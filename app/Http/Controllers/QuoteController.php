<?php

namespace App\Http\Controllers;

use App\Mail\QuoteApproval;
use App\Models\Activity;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Quote;
use App\Models\QuoteItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class QuoteController extends Controller
{
    public function index(Request $request)
    {
        $quotes = Quote::with(['client', 'project'])
            ->when($request->client_id, fn ($q, $id) => $q->where('client_id', $id))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->orderByDesc('created_at')
            ->paginate(15);

        return inertia('Quotes/Index', [
            'quotes' => $quotes,
        ]);
    }

    public function create(Request $request)
    {
        $clients = Client::with('user')->get();

        $selectedClientId = null;
        $preselectedService = $request->query('service', '');

        if ($request->query('client_email')) {
            $client = Client::whereHas('user', function ($q) use ($request) {
                $q->where('email', $request->query('client_email'));
            })->first();

            if ($client) {
                $selectedClientId = $client->id;
            }
        }

        return inertia('Quotes/Create', [
            'clients' => $clients,
            'selected_client_id' => $selectedClientId,
            'preselected_service' => $preselectedService,
        ]);
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'client_id' => 'required|exists:clients,id',
                'project_id' => 'nullable',
                'items' => 'required|array|min:1',
                'items.*.description' => 'required|string',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.unit_price' => 'required|numeric|min:0',
                'tax_rate' => 'nullable|numeric|min:0|max:100',
                'discount' => 'nullable|numeric|min:0',
                'notes' => 'nullable|string',
                'terms' => 'nullable|string',
                'valid_until' => 'nullable|date',
            ]);

            $userId = Auth::check() ? Auth::id() : null;

            $projectId = $request->input('project_id');
            $projectId = $projectId && is_numeric($projectId) && (int) $projectId > 0 ? (int) $projectId : null;

            $quote = Quote::create([
                'client_id' => (int) $validated['client_id'],
                'project_id' => $projectId,
                'quote_number' => Quote::generateQuoteNumber(),
                'status' => 'draft',
                'tax_rate' => $validated['tax_rate'] ?? 0,
                'discount' => $validated['discount'] ?? 0,
                'notes' => $validated['notes'],
                'terms' => $validated['terms'],
                'valid_until' => $validated['valid_until'],
                'created_by' => $userId,
            ]);

            foreach ($validated['items'] as $index => $item) {
                QuoteItem::create([
                    'quote_id' => $quote->id,
                    'description' => $item['description'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'order' => $index,
                ]);
            }

            $quote->calculateTotals();
            $quote->save();

            Activity::log("Cotización #{$quote->quote_number} creada", $quote->project_id);

            return redirect()->route('quotes.show', $quote)->with('success', 'Cotización creada exitosamente');
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Quote creation error: '.$e->getMessage());

            return back()->with('error', 'Error al crear cotización: '.$e->getMessage());
        }
    }

    public function show(Quote $quote)
    {
        $quote->load(['client', 'project', 'items', 'creator']);

        return inertia('Quotes/Show', [
            'quote' => $quote,
        ]);
    }

    public function edit(Quote $quote)
    {
        $quote->load('items');
        $clients = Client::all();

        return inertia('Quotes/Edit', [
            'quote' => $quote,
            'clients' => $clients,
        ]);
    }

    public function update(Request $request, Quote $quote)
    {
        if ($quote->status !== 'draft') {
            return back()->with('error', 'Solo se pueden editar cotizaciones en borrador');
        }

        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'project_id' => 'nullable|exists:projects,id',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
            'tax_rate' => 'nullable|numeric|min:0|max:100',
            'discount' => 'nullable|numeric|min:0',
            'notes' => 'nullable|string',
            'terms' => 'nullable|string',
            'valid_until' => 'nullable|date',
        ]);

        $quote->update([
            'client_id' => $validated['client_id'],
            'project_id' => $validated['project_id'] ?? null,
            'tax_rate' => $validated['tax_rate'] ?? 0,
            'discount' => $validated['discount'] ?? 0,
            'notes' => $validated['notes'],
            'terms' => $validated['terms'],
            'valid_until' => $validated['valid_until'],
        ]);

        $quote->items()->delete();

        foreach ($validated['items'] as $index => $item) {
            QuoteItem::create([
                'quote_id' => $quote->id,
                'description' => $item['description'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'order' => $index,
            ]);
        }

        $quote->calculateTotals();
        $quote->save();

        Activity::log("Cotización #{$quote->quote_number} actualizada", $quote->project_id);

        return redirect()->route('quotes.show', $quote)->with('success', 'Cotización actualizada');
    }

    public function send(Quote $quote)
    {
        if ($quote->status !== 'draft' && $quote->status !== 'sent') {
            return back()->with('error', 'La cotización no puede ser enviada');
        }

        $token = Str::random(64);
        $expiresAt = now()->addDays(15);

        $quote->update([
            'status' => 'sent',
            'sent_at' => now(),
            'approval_token' => $token,
            'approval_token_expires_at' => $expiresAt,
        ]);

        $clientEmail = $quote->client->user->email;
        $approvalUrl = route('quotes.approve', ['quote' => $quote->id, 'token' => $token]);

        try {
            Mail::to($clientEmail)->send(new QuoteApproval($quote, $approvalUrl));
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Error sending quote email: '.$e->getMessage());
        }

        Activity::log("Cotización #{$quote->quote_number} enviada", $quote->project_id);

        return back()->with('success', 'Cotización enviada exitosamente');
    }

    public function approve(Request $request, Quote $quote)
    {
        $token = $request->query('token');
        $action = $request->query('action', 'approve');

        if (! $token || $quote->approval_token !== $token) {
            abort(403, 'Token inválido');
        }

        if ($quote->approval_token_expires_at < now()) {
            abort(403, 'El enlace ha expirado');
        }

        if ($action === 'reject') {
            $quote->update([
                'status' => 'rejected',
                'approval_token' => null,
                'approval_token_expires_at' => null,
            ]);

            Activity::log("Cotización #{$quote->quote_number} rechazada por el cliente", $quote->project_id);

            return inertia('Quotes/ClientResponse', [
                'quote' => $quote,
                'accepted' => false,
            ]);
        }

        $quote->update([
            'status' => 'accepted',
            'accepted_at' => now(),
            'approval_token' => null,
            'approval_token_expires_at' => null,
        ]);

        Activity::log("Cotización #{$quote->quote_number} aceptada por el cliente", $quote->project_id);

        return inertia('Quotes/ClientResponse', [
            'quote' => $quote,
            'accepted' => true,
        ]);
    }

    public function accept(Quote $quote)
    {
        if ($quote->status !== 'sent' && $quote->status !== 'viewed') {
            return back()->with('error', 'La cotización no puede ser aceptada');
        }

        $quote->update([
            'status' => 'accepted',
            'accepted_at' => now(),
        ]);

        Activity::log("Cotización #{$quote->quote_number} aceptada", $quote->project_id);

        return back()->with('success', 'Cotización aceptada');
    }

    public function reject(Quote $quote)
    {
        $quote->update(['status' => 'rejected']);

        Activity::log("Cotización #{$quote->quote_number} rechazada", $quote->project_id);

        return back()->with('info', 'Cotización rechazada');
    }

    public function destroy(Quote $quote)
    {
        if ($quote->status !== 'draft') {
            return back()->with('error', 'Solo se pueden eliminar cotizaciones en borrador');
        }

        $quote->items()->delete();
        $quote->delete();

        return redirect()->route('quotes.index')->with('success', 'Cotización eliminada');
    }

    public function convertToInvoice(Quote $quote)
    {
        if ($quote->status !== 'accepted') {
            return back()->with('error', 'Solo se pueden convertir cotizaciones aceptadas');
        }

        $userId = Auth::check() ? Auth::id() : null;

        $invoice = Invoice::create([
            'client_id' => $quote->client_id,
            'project_id' => $quote->project_id,
            'quote_id' => $quote->id,
            'invoice_number' => Invoice::generateInvoiceNumber(),
            'status' => 'draft',
            'subtotal' => $quote->subtotal,
            'tax_rate' => $quote->tax_rate,
            'tax_amount' => $quote->tax_amount,
            'discount' => $quote->discount,
            'total' => $quote->total,
            'paid_amount' => 0,
            'due_amount' => $quote->total,
            'issue_date' => now()->toDateString(),
            'due_date' => now()->addDays(30)->toDateString(),
            'notes' => $quote->notes,
            'terms' => $quote->terms,
            'created_by' => $userId,
        ]);

        foreach ($quote->items as $item) {
            InvoiceItem::create([
                'invoice_id' => $invoice->id,
                'description' => $item->description,
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'subtotal' => $item->subtotal,
                'order' => $item->order,
            ]);
        }

        Activity::log("Factura #{$invoice->invoice_number} creada desde cotización #{$quote->quote_number}", $quote->project_id);

        return redirect()->route('invoices.show', $invoice)->with('success', 'Factura creada desde cotización');
    }
}
