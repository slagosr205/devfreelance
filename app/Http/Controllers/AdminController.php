<?php

namespace App\Http\Controllers;

use App\Models\Client;
use App\Models\Contact;
use App\Models\PageVisit;
use App\Models\Payment;
use App\Models\Project;
use App\Models\Quote;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware(['auth', 'verified']);
    }

    public function index()
    {
        $user = auth()->user();

        if (! $user->isAdmin()) {
            abort(403, 'Acceso denegado');
        }

        $stats = [
            'totalClients' => Client::count(),
            'activeClients' => Client::where('status', 'active')->count(),
            'totalProjects' => Project::count(),
            'activeProjects' => Project::where('status', 'in_progress')->count(),
            'completedProjects' => Project::where('status', 'completed')->count(),
            'totalRevenue' => Payment::where('status', 'completed')->sum('amount'),
            'pendingPayments' => Payment::where('status', 'pending')->count(),
            'totalVisits' => PageVisit::count(),
            'todayVisits' => PageVisit::whereDate('visited_at', today())->count(),
        ];

        $recentClients = Client::with('user')
            ->latest()
            ->take(5)
            ->get();

        $recentProjects = Project::with('client.user')
            ->latest()
            ->take(5)
            ->get();

        $recentPayments = Payment::with('client.user')
            ->latest()
            ->take(5)
            ->get();

        $projectsByStatus = Project::select('status')
            ->selectRaw('count(*) as count')
            ->groupBy('status')
            ->get();

        $projectsByType = Project::select('type')
            ->selectRaw('count(*) as count')
            ->groupBy('type')
            ->get();

        $visitsByCountry = PageVisit::select('country')
            ->selectRaw('count(*) as count')
            ->whereNotNull('country')
            ->groupBy('country')
            ->orderByDesc('count')
            ->limit(10)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentClients' => $recentClients,
            'recentProjects' => $recentProjects,
            'recentPayments' => $recentPayments,
            'projectsByStatus' => $projectsByStatus,
            'projectsByType' => $projectsByType,
            'visitsByCountry' => $visitsByCountry,
        ]);
    }

    public function clients()
    {
        $user = auth()->user();

        if (! $user->isAdmin()) {
            abort(403, 'Acceso denegado');
        }

        $clients = Client::with('user', 'projects', 'payments')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Clients', [
            'clients' => $clients,
        ]);
    }

    public function projects()
    {
        $user = auth()->user();

        if (! $user->isAdmin()) {
            abort(403, 'Acceso denegado');
        }

        $projects = Project::with('client.user', 'payments')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Projects', [
            'projects' => $projects,
        ]);
    }

    public function payments()
    {
        $user = auth()->user();

        if (! $user->isAdmin()) {
            abort(403, 'Acceso denegado');
        }

        $payments = Payment::with('client.user', 'project')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Payments', [
            'payments' => $payments,
        ]);
    }

    public function visits()
    {
        $user = auth()->user();

        if (! $user->isAdmin()) {
            abort(403, 'Acceso denegado');
        }

        $visits = PageVisit::latest()
            ->paginate(20);

        return Inertia::render('Admin/Visits', [
            'visits' => $visits,
        ]);
    }

    public function createClient(Request $request)
    {
        $user = auth()->user();

        if (! $user->isAdmin()) {
            abort(403, 'Acceso denegado');
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'company_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'country' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
            'status' => 'required|in:active,inactive,prospect',
        ]);

        $client = Client::create($validated);

        return back()->with('success', 'Cliente creado correctamente');
    }

    public function updateClient(Request $request, Client $client)
    {
        $user = auth()->user();

        if (! $user->isAdmin()) {
            abort(403, 'Acceso denegado');
        }

        $validated = $request->validate([
            'company_name' => 'nullable|string|max:255',
            'phone' => 'nullable|string|max:50',
            'country' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'notes' => 'nullable|string',
            'status' => 'required|in:active,inactive,prospect',
        ]);

        $client->update($validated);

        return back()->with('success', 'Cliente actualizado correctamente');
    }

    public function createProject(Request $request)
    {
        $user = auth()->user();

        if (! $user->isAdmin()) {
            abort(403, 'Acceso denegado');
        }

        $validated = $request->validate([
            'client_id' => 'required|exists:clients,id',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:sap_b1,odoo,custom,integration,consulting',
            'status' => 'required|in:pending,in_progress,completed,cancelled,on_hold',
            'budget' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'requirements' => 'nullable|string',
        ]);

        Project::create($validated);

        return back()->with('success', 'Proyecto creado correctamente');
    }

    public function updateProject(Request $request, Project $project)
    {
        $user = auth()->user();

        if (! $user->isAdmin()) {
            abort(403, 'Acceso denegado');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:sap_b1,odoo,custom,integration,consulting',
            'status' => 'required|in:pending,in_progress,completed,cancelled,on_hold',
            'budget' => 'nullable|numeric|min:0',
            'start_date' => 'nullable|date',
            'end_date' => 'nullable|date',
            'requirements' => 'nullable|string',
        ]);

        $project->update($validated);

        return back()->with('success', 'Proyecto actualizado correctamente');
    }

    public function users()
    {
        $user = auth()->user();

        if (! $user->isAdmin()) {
            abort(403, 'Acceso denegado');
        }

        $users = User::with('client')
            ->latest()
            ->paginate(10);

        return Inertia::render('Admin/Users', [
            'users' => $users,
        ]);
    }

    public function makeAdmin(User $user)
    {
        $admin = auth()->user();

        if (! $admin->isAdmin()) {
            abort(403, 'Acceso denegado');
        }

        $user->update(['is_admin' => true]);

        return back()->with('success', 'Usuario actualizado a administrador');
    }

    public function removeAdmin(User $user)
    {
        $admin = auth()->user();

        if (! $admin->isAdmin()) {
            abort(403, 'Acceso denegado');
        }

        if ($user->id === $admin->id) {
            return back()->with('error', 'No puedes quitarte el rol de administrador');
        }

        $user->update(['is_admin' => false]);

        return back()->with('success', 'Usuario removido como administrador');
    }

    public function createUser(Request $request)
    {
        $admin = auth()->user();

        if (! $admin->isAdmin()) {
            abort(403, 'Acceso denegado');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => $validated['password'],
            'email_verified_at' => now(),
        ]);

        return back()->with('success', 'Usuario creado correctamente');
    }

    public function updateUser(Request $request, User $user)
    {
        $admin = auth()->user();

        if (! $admin->isAdmin()) {
            abort(403, 'Acceso denegado');
        }

        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
        ];

        if ($request->password) {
            $rules['password'] = 'string|min:8|confirmed';
        }

        $validated = $request->validate($rules);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        if ($request->password) {
            $updateData['password'] = $validated['password'];
        }

        $user->update($updateData);

        return back()->with('success', 'Usuario actualizado correctamente');
    }

    public function contacts()
    {
        $user = auth()->user();

        if (! $user->isAdmin()) {
            abort(403, 'Acceso denegado');
        }

        $contacts = Contact::latest()->paginate(15);

        return Inertia::render('Admin/Contacts', [
            'contacts' => $contacts,
        ]);
    }

    public function generateQuote(Request $request, Contact $contact)
    {
        $validated = $request->validate([
            'service' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $client = Client::whereHas('user', function ($query) use ($contact) {
            $query->where('email', $contact->email);
        })->first();

        if (! $client) {
            return redirect()->route('quotes.create', [
                'client_email' => $contact->email,
                'service' => $validated['service'],
            ])->with('info', 'Cliente no encontrado. Por favor selecciona o crea un cliente.');
        }

        $quote = Quote::create([
            'client_id' => $client->id,
            'quote_number' => Quote::generateQuoteNumber(),
            'status' => 'draft',
            'subtotal' => 0,
            'tax_rate' => 15,
            'tax_amount' => 0,
            'discount' => 0,
            'total' => 0,
            'notes' => $validated['description'],
            'valid_until' => now()->addDays(30),
            'created_by' => auth()->id(),
        ]);

        $contact->update(['contacted' => true]);

        return redirect()->route('admin.contacts')->with('success', 'Cotización creada exitosamente para '.$client->user->name)->with('quote_id', $quote->id);
    }

    public function enableClientAccess(Client $client)
    {
        $user = $client->user;

        if (! $user) {
            return back()->with('error', 'El cliente no tiene usuario asociado');
        }

        $tempPassword = substr(md5(time()), 0, 8);

        $user->update([
            'password' => bcrypt($tempPassword),
        ]);

        return back()->with('success', "Usuario habilitado. Contraseña temporal: {$tempPassword}");
    }
}
