import { Head } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Stats {
    totalClients: number;
    activeClients: number;
    totalProjects: number;
    activeProjects: number;
    completedProjects: number;
    totalRevenue: number;
    pendingPayments: number;
    totalVisits: number;
    todayVisits: number;
}

interface Client {
    id: number;
    user_id: number;
    company_name: string | null;
    phone: string | null;
    country: string | null;
    status: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
}

interface Project {
    id: number;
    name: string;
    type: string;
    status: string;
    budget: number | null;
    client: {
        user: {
            name: string;
        };
    };
}

interface Payment {
    id: number;
    amount: number;
    status: string;
    created_at: string;
    client: {
        user: {
            name: string;
        };
    };
}

interface StatusCount {
    status: string;
    count: number;
}

interface TypeCount {
    type: string;
    count: number;
}

interface CountryCount {
    country: string;
    count: number;
}

interface DashboardProps {
    stats: Stats;
    recentClients: Client[];
    recentProjects: Project[];
    recentPayments: Payment[];
    projectsByStatus: StatusCount[];
    projectsByType: TypeCount[];
    visitsByCountry: CountryCount[];
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    in_progress: 'bg-blue-500/20 text-blue-400',
    completed: 'bg-emerald-500/20 text-emerald-400',
    cancelled: 'bg-red-500/20 text-red-400',
    on_hold: 'bg-gray-500/20 text-gray-400',
    active: 'bg-emerald-500/20 text-emerald-400',
    inactive: 'bg-gray-500/20 text-gray-400',
    prospect: 'bg-violet-500/20 text-violet-400',
};

const typeLabels: Record<string, string> = {
    sap_b1: 'SAP Business One',
    odoo: 'Odoo ERP',
    custom: 'Desarrollo Personalizado',
    integration: 'Integración',
    consulting: 'Consultoría',
};

export default function AdminDashboard({
    stats,
    recentClients,
    recentProjects,
    recentPayments,
    projectsByStatus,
    projectsByType,
    visitsByCountry,
}: {
    stats: Stats;
    recentClients: Client[];
    recentProjects: Project[];
    recentPayments: Payment[];
    projectsByStatus: StatusCount[];
    projectsByType: TypeCount[];
    visitsByCountry: CountryCount[];
}) {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const navItems = [
        { name: 'Dashboard', href: '/admin/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'Clientes', href: '/admin/clients', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { name: 'Proyectos', href: '/admin/projects', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
        { name: 'Pagos', href: '/admin/payments', icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z' },
        { name: 'Estadísticas', href: '/admin/visits', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
        { name: 'Usuarios', href: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Admin - Dashboard" />
            
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Clientes Totales</p>
                                <p className="text-3xl font-bold text-white mt-1">{stats.totalClients}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-emerald-400 text-sm mt-2">{stats.activeClients} activos</p>
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Proyectos</p>
                                <p className="text-3xl font-bold text-white mt-1">{stats.totalProjects}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-blue-400 text-sm mt-2">{stats.activeProjects} en progreso</p>
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Ingresos Totales</p>
                                <p className="text-3xl font-bold text-white mt-1">${Number(stats.totalRevenue).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-yellow-400 text-sm mt-2">{stats.pendingPayments} pagos pendientes</p>
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm">Visitas</p>
                                <p className="text-3xl font-bold text-white mt-1">{stats.totalVisits}</p>
                            </div>
                            <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </div>
                        </div>
                        <p className="text-cyan-400 text-sm mt-2">{stats.todayVisits} hoy</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                        <h3 className="text-lg font-semibold text-white mb-4">Proyectos por Estado</h3>
                        <div className="space-y-3">
                            {projectsByStatus.map((item) => (
                                <div key={item.status} className="flex items-center justify-between">
                                    <span className="text-slate-400 capitalize">{item.status.replace('_', ' ')}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-cyan-500 to-violet-500 rounded-full"
                                                style={{ width: `${(item.count / stats.totalProjects) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-white font-medium w-8">{item.count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                        <h3 className="text-lg font-semibold text-white mb-4">Proyectos por Tipo</h3>
                        <div className="space-y-3">
                            {projectsByType.map((item) => (
                                <div key={item.type} className="flex items-center justify-between">
                                    <span className="text-slate-400">{typeLabels[item.type] || item.type}</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-32 h-2 bg-slate-800 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full"
                                                style={{ width: `${(item.count / stats.totalProjects) * 100}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-white font-medium w-8">{item.count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
