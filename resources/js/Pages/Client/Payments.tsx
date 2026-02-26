import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Payment {
    id: number;
    amount: number;
    currency: string;
    status: string;
    description: string | null;
    created_at: string;
    project: {
        name: string;
    } | null;
}

interface Client {
    id: number;
    company_name: string | null;
    status: string;
}

interface ClientPaymentsPageProps {
    payments: Payment[];
    client: Client | null;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    completed: 'bg-emerald-500/20 text-emerald-400',
    failed: 'bg-red-500/20 text-red-400',
    refunded: 'bg-gray-500/20 text-gray-400',
};

export default function ClientPayments() {
    const pageProps = usePage().props as unknown as ClientPaymentsPageProps;
    const { payments, client } = pageProps;

    const totalPaid = payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + Number(p.amount), 0);

    const totalPending = payments
        .filter(p => p.status === 'pending')
        .reduce((sum, p) => sum + Number(p.amount), 0);

    return (
        <AuthenticatedLayout>
            <Head title="Mis Pagos" />
            
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white">Mis Pagos</h1>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                            <p className="text-slate-400 text-sm">Total Pagado</p>
                            <p className="text-3xl font-bold text-emerald-400 mt-1">${totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                            <p className="text-slate-400 text-sm">Pendiente</p>
                            <p className="text-3xl font-bold text-yellow-400 mt-1">${totalPending.toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                        </div>
                        <div className="bg-slate-900 rounded-xl p-6 border border-slate-800">
                            <p className="text-slate-400 text-sm">Total Transacciones</p>
                            <p className="text-3xl font-bold text-white mt-1">{payments.length}</p>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">ID</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Proyecto</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Monto</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Estado</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Fecha</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {payments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-slate-800/30">
                                        <td className="px-6 py-4 text-slate-300">#{payment.id}</td>
                                        <td className="px-6 py-4 text-slate-300">{payment.project?.name || '-'}</td>
                                        <td className="px-6 py-4 text-white font-medium">${Number(payment.amount).toLocaleString('en-US', { minimumFractionDigits: 2 })} {payment.currency}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs ${statusColors[payment.status]}`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">
                                            {new Date(payment.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {payments.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                No hay pagos registrados
                            </div>
                        )}
                    </div>
            </div>
        </AuthenticatedLayout>
    );
}
