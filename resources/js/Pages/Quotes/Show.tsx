import { Head, useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface QuoteItem {
    id: number;
    description: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
}

interface Quote {
    id: number;
    quote_number: string;
    status: string;
    subtotal: number;
    tax_rate: number;
    tax_amount: number;
    discount: number;
    total: number;
    notes: string | null;
    terms: string | null;
    valid_until: string | null;
    sent_at: string | null;
    viewed_at: string | null;
    accepted_at: string | null;
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
    items: QuoteItem[];
    creator: {
        name: string;
    };
}

interface QuoteShowProps {
    quote: Quote;
}

const statusColors: Record<string, string> = {
    draft: 'bg-slate-500/20 text-slate-400',
    sent: 'bg-blue-500/20 text-blue-400',
    viewed: 'bg-amber-500/20 text-amber-400',
    accepted: 'bg-emerald-500/20 text-emerald-400',
    rejected: 'bg-red-500/20 text-red-400',
    expired: 'bg-orange-500/20 text-orange-400',
};

export default function QuoteShow() {
    const pageProps = usePage().props as unknown as QuoteShowProps;
    const { quote } = pageProps;
    const { post, processing } = useForm({});

    return (
        <AuthenticatedLayout>
            <Head title={`Cotización ${quote.quote_number}`} />
            
            <div className="min-h-screen bg-slate-950">
                <header className="bg-slate-900 border-b border-slate-800 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <a href="/quotes" className="text-slate-400 hover:text-white">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </a>
                            <div>
                                <h1 className="text-2xl font-bold text-white">{quote.quote_number}</h1>
                                <span className={`px-3 py-1 rounded-full text-xs ${statusColors[quote.status]}`}>
                                    {quote.status}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <a
                                href={`/quotes/${quote.id}/pdf`}
                                target="_blank"
                                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Descargar PDF
                            </a>
                            {quote.status === 'draft' && (
                                <button
                                    onClick={() => post(`/quotes/${quote.id}/send`)}
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50"
                                >
                                    Enviar al Cliente
                                </button>
                            )}
                            {(quote.status === 'sent' || quote.status === 'viewed') && (
                                <button
                                    onClick={() => post(`/quotes/${quote.id}/accept`)}
                                    disabled={processing}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 disabled:opacity-50"
                                >
                                    Aceptar Cotización
                                </button>
                            )}
                            {quote.status === 'accepted' && (
                                <>
                                    <button
                                        onClick={async () => {
                                            try {
                                                const response = await fetch(`/payment/quote/${quote.id}`, {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                                                    },
                                                });
                                                const data = await response.json();
                                                if (data.success && data.approvalUrl) {
                                                    window.location.href = data.approvalUrl;
                                                } else {
                                                    alert('Error al iniciar el pago: ' + (data.error || 'Error desconocido'));
                                                }
                                            } catch (error) {
                                                alert('Error al iniciar el pago');
                                            }
                                        }}
                                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500"
                                    >
                                        Pagar con PayPal
                                    </button>
                                    <button
                                        onClick={() => post(`/quotes/${quote.id}/convert`)}
                                        disabled={processing}
                                        className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-500 disabled:opacity-50"
                                    >
                                        Convertir a Factura
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                            <h3 className="text-slate-400 text-sm mb-1">Cliente</h3>
                            <p className="text-white font-medium">{quote.client.company_name || quote.client.user?.name || 'Cliente sin nombre'}</p>
                            <p className="text-slate-400 text-sm">{quote.client.user?.email}</p>
                        </div>
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                            <h3 className="text-slate-400 text-sm mb-1">Proyecto</h3>
                            <p className="text-white font-medium">{quote.project?.name || 'Sin proyecto'}</p>
                        </div>
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                            <h3 className="text-slate-400 text-sm mb-1">Válido hasta</h3>
                            <p className="text-white font-medium">
                                {quote.valid_until ? new Date(quote.valid_until).toLocaleDateString() : 'Sin fecha'}
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden mb-8">
                        <table className="w-full">
                            <thead className="bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Descripción</th>
                                    <th className="px-6 py-4 text-center text-slate-400 font-medium">Cantidad</th>
                                    <th className="px-6 py-4 text-right text-slate-400 font-medium">Precio Unit.</th>
                                    <th className="px-6 py-4 text-right text-slate-400 font-medium">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {quote.items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-6 py-4 text-white">{item.description}</td>
                                        <td className="px-6 py-4 text-slate-300 text-center">{item.quantity}</td>
                                        <td className="px-6 py-4 text-slate-300 text-right">${Number(item.unit_price).toFixed(2)}</td>
                                        <td className="px-6 py-4 text-white text-right font-medium">${Number(item.subtotal).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end">
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 w-80">
                            <div className="space-y-3">
                                <div className="flex justify-between text-slate-400">
                                    <span>Subtotal</span>
                                    <span className="text-white">${Number(quote.subtotal).toFixed(2)}</span>
                                </div>
                                {quote.tax_rate > 0 && (
                                    <div className="flex justify-between text-slate-400">
                                        <span>Impuesto ({quote.tax_rate}%)</span>
                                        <span className="text-white">${Number(quote.tax_amount).toFixed(2)}</span>
                                    </div>
                                )}
                                {quote.discount > 0 && (
                                    <div className="flex justify-between text-slate-400">
                                        <span>Descuento</span>
                                        <span className="text-emerald-400">-${Number(quote.discount).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="pt-3 border-t border-slate-700 flex justify-between text-lg font-bold">
                                    <span className="text-white">Total</span>
                                    <span className="text-cyan-400">${Number(quote.total).toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {(quote.notes || quote.terms) && (
                        <div className="grid grid-cols-2 gap-6 mt-8">
                            {quote.notes && (
                                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                                    <h3 className="text-white font-medium mb-2">Notas</h3>
                                    <p className="text-slate-400 text-sm">{quote.notes}</p>
                                </div>
                            )}
                            {quote.terms && (
                                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                                    <h3 className="text-white font-medium mb-2">Términos y Condiciones</h3>
                                    <p className="text-slate-400 text-sm">{quote.terms}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="mt-8 bg-slate-900 rounded-2xl border border-slate-800 p-6">
                        <h3 className="text-white font-medium mb-4">Información</h3>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div>
                                <span className="text-slate-400">Creado por:</span>
                                <span className="text-white ml-2">{quote.creator.name}</span>
                            </div>
                            <div>
                                <span className="text-slate-400">Fecha de creación:</span>
                                <span className="text-white ml-2">{new Date(quote.created_at).toLocaleDateString()}</span>
                            </div>
                            {quote.sent_at && (
                                <div>
                                    <span className="text-slate-400">Enviado:</span>
                                    <span className="text-white ml-2">{new Date(quote.sent_at).toLocaleString()}</span>
                                </div>
                            )}
                            {quote.accepted_at && (
                                <div>
                                    <span className="text-slate-400">Aceptado:</span>
                                    <span className="text-emerald-400 ml-2">{new Date(quote.accepted_at).toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
