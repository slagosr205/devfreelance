import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Payment {
    id: number;
    client_id: number;
    project_id: number | null;
    paypal_payment_id: string | null;
    amount: number;
    currency: string;
    status: string;
    description: string | null;
    created_at: string;
    client: {
        user: {
            name: string;
            email: string;
        };
    };
    project: {
        name: string;
    } | null;
}

interface PaymentsPageProps {
    payments: {
        data: Payment[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    completed: 'bg-emerald-500/20 text-emerald-400',
    failed: 'bg-red-500/20 text-red-400',
    refunded: 'bg-gray-500/20 text-gray-400',
};

export default function AdminPayments() {
    const pageProps = usePage().props as unknown as PaymentsPageProps;
    const { payments } = pageProps;

    return (
        <AuthenticatedLayout>
            <Head title="Admin - Pagos" />
            
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white">Pagos</h1>
                <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">ID</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Cliente</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Proyecto</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Monto</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Estado</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Fecha</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {payments.data.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-slate-800/30">
                                        <td className="px-6 py-4 text-slate-300">#{payment.id}</td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-white font-medium">{payment.client.user.name}</p>
                                                <p className="text-slate-500 text-sm">{payment.client.user.email}</p>
                                            </div>
                                        </td>
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
                        {payments.data.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                No hay pagos registrados
                            </div>
                        )}
                    </div>
            </div>
        </AuthenticatedLayout>
    );
}
