<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use App\Models\Invoice;
use App\Models\Project;
use App\Models\Quote;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index()
    {
        $quoteStats = [
            'total' => Quote::count(),
            'draft' => Quote::where('status', 'draft')->count(),
            'sent' => Quote::whereIn('status', ['sent', 'viewed'])->count(),
            'accepted' => Quote::where('status', 'accepted')->count(),
            'rejected' => Quote::where('status', 'rejected')->count(),
            'total_value' => Quote::where('status', 'accepted')->sum('total'),
        ];

        $invoiceStats = [
            'total' => Invoice::count(),
            'draft' => Invoice::where('status', 'draft')->count(),
            'sent' => Invoice::whereIn('status', ['sent', 'viewed'])->count(),
            'paid' => Invoice::where('status', 'paid')->count(),
            'partial' => Invoice::where('status', 'partial')->count(),
            'overdue' => Invoice::where('status', 'overdue')->count(),
            'total_value' => Invoice::sum('total'),
            'paid_value' => Invoice::sum('paid_amount'),
            'pending_value' => Invoice::sum(DB::raw('total - paid_amount')),
        ];

        $recentQuotes = Quote::with(['client'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        $recentInvoices = Invoice::with(['client'])
            ->orderByDesc('created_at')
            ->limit(5)
            ->get();

        $recentActivities = Activity::with('project')
            ->orderByDesc('created_at')
            ->limit(10)
            ->get();

        $projectStats = [
            'total' => Project::count(),
            'active' => Project::where('status', 'active')->count(),
            'completed' => Project::where('status', 'completed')->count(),
            'on_hold' => Project::where('status', 'on_hold')->count(),
        ];

        return inertia('Dashboard', [
            'isAdmin' => auth()->user()->isAdmin(),
            'quoteStats' => $quoteStats,
            'invoiceStats' => $invoiceStats,
            'recentQuotes' => $recentQuotes,
            'recentInvoices' => $recentInvoices,
            'recentActivities' => $recentActivities,
            'projectStats' => $projectStats,
        ]);
    }
}
