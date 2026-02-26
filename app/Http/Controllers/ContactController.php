<?php

namespace App\Http\Controllers;

use App\Mail\ContactConfirmation;
use App\Models\Client;
use App\Models\Contact;
use App\Models\Quote;
use App\Models\QuoteItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class ContactController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'nullable|string|max:50',
            'company' => 'nullable|string|max:255',
            'service' => 'nullable|string|max:255',
            'message' => 'required|string',
        ]);

        $contactData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'service' => $validated['service'] ?? null,
            'message' => $validated['message'],
        ];
        $contact = Contact::create($contactData);

        $client = Client::whereHas('user', function ($query) use ($validated) {
            $query->where('email', $validated['email']);
        })->first();

        if (! $client) {
            $user = \App\Models\User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => bcrypt('changeme123'),
            ]);

            $client = Client::create([
                'user_id' => $user->id,
                'company_name' => $validated['company'] ?? null,
                'phone' => $validated['phone'] ?? null,
                'status' => 'prospect',
                'contact_name' => $validated['name'],
                'contact_email' => $validated['email'],
                'contact_service' => $validated['service'],
                'contact_message' => $validated['message'],
            ]);
        } else {
            $client->update([
                'company_name' => $validated['company'] ?? $client->company_name,
                'phone' => $validated['phone'] ?? $client->phone,
                'contact_name' => $validated['name'],
                'contact_email' => $validated['email'],
                'contact_service' => $validated['service'],
                'contact_message' => $validated['message'],
            ]);
        }

        try {
            Mail::to($contact->email)->send(new ContactConfirmation($contact));
        } catch (\Exception $e) {
            Log::error('Error sending email: '.$e->getMessage());
        }

        return response()->json([
            'success' => true,
            'message' => 'Tu mensaje ha sido enviado correctamente. Te contactaremos pronto.',
            'client_id' => $client->id,
        ]);
    }

    public function createQuote(Request $request, Client $client)
    {
        $validated = $request->validate([
            'service' => 'required|string|max:255',
            'description' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.description' => 'required|string',
            'items.*.quantity' => 'required|numeric|min:1',
            'items.*.unit_price' => 'required|numeric|min:0',
        ]);

        $quote = Quote::create([
            'client_id' => $client->id,
            'quote_number' => Quote::generateQuoteNumber(),
            'status' => 'draft',
            'subtotal' => 0,
            'tax_rate' => 15,
            'tax_amount' => 0,
            'discount' => 0,
            'total' => 0,
            'valid_until' => now()->addDays(30),
            'created_by' => auth()->id(),
        ]);

        $subtotal = 0;
        $order = 0;
        foreach ($validated['items'] as $item) {
            $itemSubtotal = $item['quantity'] * $item['unit_price'];
            QuoteItem::create([
                'quote_id' => $quote->id,
                'description' => $item['description'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['unit_price'],
                'subtotal' => $itemSubtotal,
                'order' => $order++,
            ]);
            $subtotal += $itemSubtotal;
        }

        $taxAmount = $subtotal * (15 / 100);
        $quote->update([
            'subtotal' => $subtotal,
            'tax_amount' => $taxAmount,
            'total' => $subtotal + $taxAmount,
        ]);

        return response()->json([
            'success' => true,
            'quote_id' => $quote->id,
            'message' => 'Cotización creada correctamente',
        ]);
    }
}
