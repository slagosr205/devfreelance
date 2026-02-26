<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Payment;
use App\Models\Project;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ClientController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    public function projects(Request $request)
    {
        $user = $request->user();

        $client = Client::where('user_id', $user->id)->first();

        if (! $client) {
            $client = Client::create([
                'user_id' => $user->id,
                'status' => 'prospect',
            ]);
        }

        $projects = Project::where('client_id', $client->id)
            ->with('payments')
            ->latest()
            ->get();

        return Inertia::render('Client/Projects', [
            'projects' => $projects,
            'client' => $client,
        ]);
    }

    public function payments(Request $request)
    {
        $user = $request->user();

        $client = Client::where('user_id', $user->id)->first();

        if (! $client) {
            return Inertia::render('Client/Payments', [
                'payments' => [],
                'client' => null,
            ]);
        }

        $payments = Payment::where('client_id', $client->id)
            ->with('project')
            ->latest()
            ->get();

        return Inertia::render('Client/Payments', [
            'payments' => $payments,
            'client' => $client,
        ]);
    }

    public function storeProject(Request $request)
    {
        $user = $request->user();

        $client = Client::where('user_id', $user->id)->first();

        if (! $client) {
            $client = Client::create([
                'user_id' => $user->id,
                'status' => 'prospect',
            ]);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:sap_b1,odoo,custom,integration,consulting',
            'requirements' => 'nullable|string',
        ]);

        $project = Project::create([
            'client_id' => $client->id,
            'name' => $validated['name'],
            'description' => $validated['description'],
            'type' => $validated['type'],
            'status' => 'pending',
            'requirements' => $validated['requirements'],
        ]);

        return back()->with('success', 'Proyecto solicitado correctamente. Me contactaré contigo pronto.');
    }
}
