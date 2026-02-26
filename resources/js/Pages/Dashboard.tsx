import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface QuoteStats {
    total: number;
    draft: number;
    sent: number;
    accepted: number;
    rejected: number;
    total_value: number;
}

interface InvoiceStats {
    total: number;
    draft: number;
    sent: number;
    paid: number;
    partial: number;
    overdue: number;
    total_value: number;
    paid_value: number;
    pending_value: number;
}

interface ProjectStats {
    total: number;
    active: number;
    completed: number;
    on_hold: number;
}

interface RecentQuote {
    id: number;
    quote_number: string;
    status: string;
    total: number;
    created_at: string;
    client: {
        company_name: string | null;
        user: { name: string } | null;
    };
}

interface RecentInvoice {
    id: number;
    invoice_number: string;
    status: string;
    total: number;
    due_amount: number;
    created_at: string;
    client: {
        company_name: string | null;
        user: { name: string } | null;
    };
}

interface Activity {
    id: number;
    description: string;
    created_at: string;
    project: { name: string } | null;
}

interface DashboardProps {
    isAdmin: boolean;
    quoteStats: QuoteStats;
    invoiceStats: InvoiceStats;
    projectStats: ProjectStats;
    recentQuotes: RecentQuote[];
    recentInvoices: RecentInvoice[];
    recentActivities: Activity[];
}

const statusColors: Record<string, string> = {
    draft: 'bg-slate-500/20 text-slate-400',
    sent: 'bg-blue-500/20 text-blue-400',
    viewed: 'bg-amber-500/20 text-amber-400',
    accepted: 'bg-emerald-500/20 text-emerald-400',
    rejected: 'bg-red-500/20 text-red-400',
    paid: 'bg-emerald-500/20 text-emerald-400',
    partial: 'bg-orange-500/20 text-orange-400',
    overdue: 'bg-red-500/20 text-red-400',
};

export default function Dashboard() {
    const pageProps = usePage().props as unknown as DashboardProps;
    const { isAdmin, quoteStats, invoiceStats, projectStats, recentQuotes, recentInvoices, recentActivities } = pageProps;

    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />
            
            <div className="space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <span className="text-3xl font-bold text-white">{quoteStats.total}</span>
                            </div>
                            <h3 className="text-slate-400 font-medium">Cotizaciones</h3>
                            <p className="text-emerald-400 text-sm mt-1">
                                ${Number(quoteStats.total_value).toFixed(2)} aceptadas
                            </p>
                        </div>

                        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                                    </svg>
                                </div>
                                <span className="text-3xl font-bold text-white">{invoiceStats.total}</span>
                            </div>
                            <h3 className="text-slate-400 font-medium">Facturas</h3>
                            <p className="text-orange-400 text-sm mt-1">
                                ${Number(invoiceStats.pending_value).toFixed(2)} pendientes
                            </p>
                        </div>

                        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span className="text-3xl font-bold text-emerald-400">${Number(invoiceStats.paid_value).toFixed(0)}</span>
                            </div>
                            <h3 className="text-slate-400 font-medium">Ingresos</h3>
                            <p className="text-slate-500 text-sm mt-1">
                                de ${Number(invoiceStats.total_value).toFixed(2)} total
                            </p>
                        </div>

                        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <span className="text-3xl font-bold text-white">{projectStats.total}</span>
                            </div>
                            <h3 className="text-slate-400 font-medium">Proyectos</h3>
                            <p className="text-blue-400 text-sm mt-1">
                                {projectStats.active} activos
                            </p>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <a
                            href="/quotes"
                            className="bg-slate-900 rounded-xl p-6 hover:bg-slate-800 transition-colors border border-slate-800"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white font-semibold">Cotizaciones</p>
                                    <p className="text-slate-500 text-sm">Crear y enviar</p>
                                </div>
                            </div>
                        </a>

                        <a
                            href="/invoices"
                            className="bg-slate-900 rounded-xl p-6 hover:bg-slate-800 transition-colors border border-slate-800"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-amber-500/20 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white font-semibold">Facturas</p>
                                    <p className="text-slate-500 text-sm">Gestionar cobros</p>
                                </div>
                            </div>
                        </a>

                        <a
                            href="/projects-board"
                            className="bg-slate-900 rounded-xl p-6 hover:bg-slate-800 transition-colors border border-slate-800"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white font-semibold">Proyectos</p>
                                    <p className="text-slate-500 text-sm">Tablero Kanban</p>
                                </div>
                            </div>
                        </a>

                        <a
                            href="/profile"
                            className="bg-slate-900 rounded-xl p-6 hover:bg-slate-800 transition-colors border border-slate-800"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                                    <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-white font-semibold">Mi Perfil</p>
                                    <p className="text-slate-500 text-sm">Editar información</p>
                                </div>
                            </div>
                        </a>
                    </div>

                    {/* Recent Activity & Lists */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Recent Quotes */}
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                                <h3 className="text-white font-semibold">Cotizaciones Recientes</h3>
                                <a href="/quotes" className="text-blue-400 text-sm hover:underline">Ver todas</a>
                            </div>
                            <div className="divide-y divide-slate-800">
                                {recentQuotes.length === 0 ? (
                                    <p className="px-6 py-4 text-slate-500">Sin cotizaciones</p>
                                ) : (
                                    recentQuotes.map((quote) => (
                                        <a key={quote.id} href={`/quotes/${quote.id}`} className="px-6 py-4 hover:bg-slate-800/50 transition-colors flex items-center justify-between">
                                            <div>
                                                <p className="text-white font-medium">{quote.quote_number}</p>
                                                <p className="text-slate-500 text-sm">
                                                    {quote.client?.company_name || quote.client?.user?.name || 'Cliente'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white font-medium">${Number(quote.total).toFixed(2)}</p>
                                                <span className={`text-xs px-2 py-1 rounded-full ${statusColors[quote.status]}`}>
                                                    {quote.status}
                                                </span>
                                            </div>
                                        </a>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Recent Invoices */}
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
                                <h3 className="text-white font-semibold">Facturas Recientes</h3>
                                <a href="/invoices" className="text-blue-400 text-sm hover:underline">Ver todas</a>
                            </div>
                            <div className="divide-y divide-slate-800">
                                {recentInvoices.length === 0 ? (
                                    <p className="px-6 py-4 text-slate-500">Sin facturas</p>
                                ) : (
                                    recentInvoices.map((invoice) => (
                                        <a key={invoice.id} href={`/invoices/${invoice.id}`} className="px-6 py-4 hover:bg-slate-800/50 transition-colors flex items-center justify-between">
                                            <div>
                                                <p className="text-white font-medium">{invoice.invoice_number}</p>
                                                <p className="text-slate-500 text-sm">
                                                    {invoice.client?.company_name || invoice.client?.user?.name || 'Cliente'}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white font-medium">${Number(invoice.due_amount).toFixed(2)}</p>
                                                <span className={`text-xs px-2 py-1 rounded-full ${statusColors[invoice.status]}`}>
                                                    {invoice.status}
                                                </span>
                                            </div>
                                        </a>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-800">
                                <h3 className="text-white font-semibold">Actividad Reciente</h3>
                            </div>
                            <div className="divide-y divide-slate-800">
                                {recentActivities.length === 0 ? (
                                    <p className="px-6 py-4 text-slate-500">Sin actividad</p>
                                ) : (
                                    recentActivities.map((activity) => (
                                        <div key={activity.id} className="px-6 py-4">
                                            <p className="text-white text-sm">{activity.description}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                {activity.project && (
                                                    <span className="text-slate-500 text-xs">{activity.project.name}</span>
                                                )}
                                                <span className="text-slate-600 text-xs">
                                                    {new Date(activity.created_at).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Admin Section */}
                    {isAdmin && (
                        <div className="border-t border-slate-800 pt-8">
                            <h2 className="text-xl font-semibold text-white mb-4">Administración</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                <a
                                    href="/admin/dashboard"
                                    className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl p-4 text-center hover:opacity-90 transition-opacity"
                                >
                                    <svg className="w-8 h-8 mx-auto text-white mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                    </svg>
                                    <p className="text-white font-medium">Dashboard</p>
                                </a>
                                <a
                                    href="/admin/clients"
                                    className="bg-slate-800 rounded-xl p-4 text-center hover:bg-slate-700 transition-colors border border-slate-700"
                                >
                                    <svg className="w-8 h-8 mx-auto text-cyan-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    <p className="text-white font-medium">Clientes</p>
                                </a>
                                <a
                                    href="/admin/projects"
                                    className="bg-slate-800 rounded-xl p-4 text-center hover:bg-slate-700 transition-colors border border-slate-700"
                                >
                                    <svg className="w-8 h-8 mx-auto text-violet-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                    <p className="text-white font-medium">Proyectos</p>
                                </a>
                                <a
                                    href="/admin/payments"
                                    className="bg-slate-800 rounded-xl p-4 text-center hover:bg-slate-700 transition-colors border border-slate-700"
                                >
                                    <svg className="w-8 h-8 mx-auto text-emerald-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                    </svg>
                                    <p className="text-white font-medium">Pagos</p>
                                </a>
                                <a
                                    href="/admin/visits"
                                    className="bg-slate-800 rounded-xl p-4 text-center hover:bg-slate-700 transition-colors border border-slate-700"
                                >
                                    <svg className="w-8 h-8 mx-auto text-rose-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                    </svg>
                                    <p className="text-white font-medium">Estadísticas</p>
                                </a>
                                <a
                                    href="/admin/users"
                                    className="bg-slate-800 rounded-xl p-4 text-center hover:bg-slate-700 transition-colors border border-slate-700"
                                >
                                    <svg className="w-8 h-8 mx-auto text-yellow-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    <p className="text-white font-medium">Usuarios</p>
                                </a>
                            </div>
                        </div>
                    )}
                </div>
        </AuthenticatedLayout>
    );
}
