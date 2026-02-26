<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Client;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function index(Request $request)
    {
        $invoices = Invoice::with(['client', 'project'])
            ->when($request->client_id, fn ($q, $id) => $q->where('client_id', $id))
            ->when($request->status, fn ($q, $s) => $q->where('status', $s))
            ->orderByDesc('created_at')
            ->paginate(15);

        return inertia('Invoices/Index', [
            'invoices' => $invoices,
        ]);
    }

    public function create()
    {
        $clients = Client::all();

        return inertia('Invoices/Create', [
            'clients' => $clients,
        ]);
    }

    public function store(Request $request)
    {
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
            'issue_date' => 'required|date',
            'due_date' => 'required|date',
        ]);

        $invoice = Invoice::create([
            'client_id' => $validated['client_id'],
            'project_id' => $validated['project_id'] ?? null,
            'invoice_number' => Invoice::generateInvoiceNumber(),
            'status' => 'draft',
            'tax_rate' => $validated['tax_rate'] ?? 0,
            'discount' => $validated['discount'] ?? 0,
            'notes' => $validated['notes'],
            'terms' => $validated['terms'],
            'issue_date' => $validated['issue_date'],
            'due_date' => $validated['due_date'],
            'created_by' => auth()->id(),
        ]);

        foreach ($validated['items'] as $index => $item) {
            InvoiceItem::create([
                'invoice_id' => $invoice->id,
                'description' => $item['description'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'order' => $index,
            ]);
        }

        $invoice->calculateTotals();
        $invoice->save();

        Activity::log("Factura #{$invoice->invoice_number} creada", $invoice->project_id);

        return redirect()->route('invoices.show', $invoice)->with('success', 'Factura creada exitosamente');
    }

    public function show(Invoice $invoice)
    {
        $invoice->load(['client', 'project', 'items', 'creator']);

        return inertia('Invoices/Show', [
            'invoice' => $invoice,
        ]);
    }

    public function edit(Invoice $invoice)
    {
        $invoice->load('items');
        $clients = Client::all();

        return inertia('Invoices/Edit', [
            'invoice' => $invoice,
            'clients' => $clients,
        ]);
    }

    public function update(Request $request, Invoice $invoice)
    {
        if ($invoice->status !== 'draft') {
            return back()->with('error', 'Solo se pueden editar facturas en borrador');
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
            'issue_date' => 'required|date',
            'due_date' => 'required|date',
        ]);

        $invoice->update([
            'client_id' => $validated['client_id'],
            'project_id' => $validated['project_id'] ?? null,
            'tax_rate' => $validated['tax_rate'] ?? 0,
            'discount' => $validated['discount'] ?? 0,
            'notes' => $validated['notes'],
            'terms' => $validated['terms'],
            'issue_date' => $validated['issue_date'],
            'due_date' => $validated['due_date'],
        ]);

        $invoice->items()->delete();

        foreach ($validated['items'] as $index => $item) {
            InvoiceItem::create([
                'invoice_id' => $invoice->id,
                'description' => $item['description'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'order' => $index,
            ]);
        }

        $invoice->calculateTotals();
        $invoice->save();

        Activity::log("Factura #{$invoice->invoice_number} actualizada", $invoice->project_id);

        return redirect()->route('invoices.show', $invoice)->with('success', 'Factura actualizada');
    }

    public function send(Invoice $invoice)
    {
        $invoice->update([
            'status' => 'sent',
            'sent_at' => now(),
        ]);

        Activity::log("Factura #{$invoice->invoice_number} enviada", $invoice->project_id);

        return back()->with('success', 'Factura enviada exitosamente');
    }

    public function markAsPaid(Request $request, Invoice $invoice)
    {
        $amount = $request->input('amount', $invoice->due_amount);

        $invoice->paid_amount += $amount;
        $invoice->due_amount = $invoice->total - $invoice->paid_amount;

        if ($invoice->due_amount <= 0) {
            $invoice->status = 'paid';
            $invoice->paid_at = now();
        } else {
            $invoice->status = 'partial';
        }

        $invoice->save();

        Activity::log("Factura #{$invoice->invoice_number} pagada: $".number_format($amount, 2), $invoice->project_id);

        return back()->with('success', 'Pago registrado');
    }

    public function cancel(Invoice $invoice)
    {
        if ($invoice->status === 'paid') {
            return back()->with('error', 'No se puede cancelar una factura pagada');
        }

        $invoice->update(['status' => 'cancelled']);

        Activity::log("Factura #{$invoice->invoice_number} cancelada", $invoice->project_id);

        return back()->with('info', 'Factura cancelada');
    }

    public function destroy(Invoice $invoice)
    {
        if ($invoice->status !== 'draft') {
            return back()->with('error', 'Solo se pueden eliminar facturas en borrador');
        }

        $invoice->items()->delete();
        $invoice->delete();

        return redirect()->route('invoices.index')->with('success', 'Factura eliminada');
    }
}
