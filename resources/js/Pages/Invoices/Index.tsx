import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Invoice {
    id: number;
    invoice_number: string;
    status: string;
    total: number;
    paid_amount: number;
    due_amount: number;
    issue_date: string;
    due_date: string;
    created_at: string;
    client: {
        id: number;
        company_name: string | null;
        user: {
            name: string;
            email: string;
        };
    };
    project: {
        id: number;
        name: string;
    } | null;
}

interface InvoicesPageProps {
    invoices: {
        data: Invoice[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

const statusColors: Record<string, string> = {
    draft: 'bg-slate-500/20 text-slate-400',
    sent: 'bg-blue-500/20 text-blue-400',
    viewed: 'bg-amber-500/20 text-amber-400',
    paid: 'bg-emerald-500/20 text-emerald-400',
    partial: 'bg-orange-500/20 text-orange-400',
    overdue: 'bg-red-500/20 text-red-400',
    cancelled: 'bg-gray-500/20 text-gray-400',
    refunded: 'bg-violet-500/20 text-violet-400',
};

export default function InvoicesIndex() {
    const pageProps = usePage().props as unknown as InvoicesPageProps;
    const { invoices } = pageProps;

    return (
        <AuthenticatedLayout>
            <Head title="Facturas" />
            
            <div className="min-h-screen bg-slate-950">
                <header className="bg-slate-900 border-b border-slate-800 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <a href="/dashboard" className="text-slate-400 hover:text-white">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </a>
                            <h1 className="text-2xl font-bold text-white">Facturas</h1>
                        </div>
                        <a
                            href="/invoices/create"
                            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-lg hover:opacity-90"
                        >
                            + Nueva Factura
                        </a>
                    </div>
                </header>

                <div className="p-8">
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Número</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Cliente</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Proyecto</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Total</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Pagado</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Pendiente</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Estado</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Vencimiento</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {invoices.data.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-slate-800/30">
                                        <td className="px-6 py-4">
                                            <a href={`/invoices/${invoice.id}`} className="text-cyan-400 hover:text-cyan-300 font-medium">
                                                {invoice.invoice_number}
                                            </a>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-white">{invoice.client.company_name || invoice.client.user?.name || 'Cliente sin nombre'}</p>
                                                <p className="text-slate-500 text-sm">{invoice.client.user?.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">
                                            {invoice.project?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-white font-medium">
                                            ${Number(invoice.total).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-emerald-400">
                                            ${Number(invoice.paid_amount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 text-orange-400">
                                            ${Number(invoice.due_amount).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs ${statusColors[invoice.status]}`}>
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">
                                            {new Date(invoice.due_date).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <a href={`/invoices/${invoice.id}`} className="text-cyan-400 hover:text-cyan-300">
                                                Ver
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {invoices.data.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                No hay facturas todavía
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
