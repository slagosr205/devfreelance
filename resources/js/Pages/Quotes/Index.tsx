import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Quote {
    id: number;
    quote_number: string;
    status: string;
    subtotal: number;
    tax_rate: number;
    tax_amount: number;
    discount: number;
    total: number;
    valid_until: string | null;
    sent_at: string | null;
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

interface QuotesPageProps {
    quotes: {
        data: Quote[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

const statusColors: Record<string, string> = {
    draft: 'bg-slate-500/20 text-slate-400',
    sent: 'bg-blue-500/20 text-blue-400',
    viewed: 'bg-amber-500/20 text-amber-400',
    accepted: 'bg-emerald-500/20 text-emerald-400',
    rejected: 'bg-red-500/20 text-red-400',
    expired: 'bg-orange-500/20 text-orange-400',
};

export default function QuotesIndex() {
    const pageProps = usePage().props as unknown as QuotesPageProps;
    const { quotes } = pageProps;

    return (
        <AuthenticatedLayout>
            <Head title="Cotizaciones" />
            
            <div className="min-h-screen bg-slate-950">
                <header className="bg-slate-900 border-b border-slate-800 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <a href="/dashboard" className="text-slate-400 hover:text-white">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </a>
                            <h1 className="text-2xl font-bold text-white">Cotizaciones</h1>
                        </div>
                        <a
                            href="/quotes/create"
                            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-lg hover:opacity-90"
                        >
                            + Nueva Cotización
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
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Estado</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Válido hasta</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {quotes.data.map((quote) => (
                                    <tr key={quote.id} className="hover:bg-slate-800/30">
                                        <td className="px-6 py-4">
                                            <a href={`/quotes/${quote.id}`} className="text-cyan-400 hover:text-cyan-300 font-medium">
                                                {quote.quote_number}
                                            </a>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-white">{quote.client.company_name || quote.client.user?.name || 'Cliente sin nombre'}</p>
                                                <p className="text-slate-500 text-sm">{quote.client.user?.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">
                                            {quote.project?.name || '-'}
                                        </td>
                                        <td className="px-6 py-4 text-white font-medium">
                                            ${Number(quote.total).toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs ${statusColors[quote.status]}`}>
                                                {quote.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">
                                            {quote.valid_until ? new Date(quote.valid_until).toLocaleDateString() : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-3">
                                                <a href={`/quotes/${quote.id}`} className="text-cyan-400 hover:text-cyan-300">
                                                    Ver
                                                </a>
                                                {quote.status === 'draft' && (
                                                    <>
                                                        <a href={`/quotes/${quote.id}/edit`} className="text-slate-400 hover:text-white">
                                                            Editar
                                                        </a>
                                                        <form method="POST" action={`/quotes/${quote.id}/send`} className="inline">
                                                            <input type="hidden" name="_token" />
                                                            <button type="submit" className="text-emerald-400 hover:text-emerald-300">
                                                                Enviar
                                                            </button>
                                                        </form>
                                                    </>
                                                )}
                                                {(quote.status === 'sent' || quote.status === 'viewed') && (
                                                    <form method="POST" action={`/quotes/${quote.id}/accept`} className="inline">
                                                        <input type="hidden" name="_token" />
                                                        <button type="submit" className="text-emerald-400 hover:text-emerald-300">
                                                            Aceptar
                                                        </button>
                                                    </form>
                                                )}
                                                {quote.status === 'accepted' && (
                                                    <form method="POST" action={`/quotes/${quote.id}/convert`} className="inline">
                                                        <input type="hidden" name="_token" />
                                                        <button type="submit" className="text-violet-400 hover:text-violet-300">
                                                            Facturar
                                                        </button>
                                                    </form>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {quotes.data.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                No hay cotizaciones todavía
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
