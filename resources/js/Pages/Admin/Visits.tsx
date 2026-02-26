import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface PageVisit {
    id: number;
    ip_address: string;
    user_agent: string;
    country: string | null;
    city: string | null;
    visited_at: string;
}

interface VisitsPageProps {
    visits: {
        data: PageVisit[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

export default function AdminVisits() {
    const pageProps = usePage().props as unknown as VisitsPageProps;
    const { visits } = pageProps;

    return (
        <AuthenticatedLayout>
            <Head title="Admin - Estadísticas de Visitas" />
            
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white">Estadísticas de Visitas</h1>
                <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                    <table className="w-full">
                            <thead className="bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">ID</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">IP</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">País</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Ciudad</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Fecha</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {visits.data.map((visit) => (
                                    <tr key={visit.id} className="hover:bg-slate-800/30">
                                        <td className="px-6 py-4 text-slate-300">#{visit.id}</td>
                                        <td className="px-6 py-4 text-slate-300 font-mono text-sm">{visit.ip_address}</td>
                                        <td className="px-6 py-4 text-slate-300">{visit.country || '-'}</td>
                                        <td className="px-6 py-4 text-slate-300">{visit.city || '-'}</td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">
                                            {new Date(visit.visited_at).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {visits.data.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                No hay visitas registradas
                            </div>
                        )}
                    </div>
            </div>
        </AuthenticatedLayout>
    );
}
