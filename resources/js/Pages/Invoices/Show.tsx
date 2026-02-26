import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface InvoiceItem {
    id: number;
    description: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
}

interface Invoice {
    id: number;
    invoice_number: string;
    status: string;
    subtotal: number;
    tax_rate: number;
    tax_amount: number;
    discount: number;
    total: number;
    paid_amount: number;
    due_amount: number;
    notes: string | null;
    terms: string | null;
    issue_date: string;
    due_date: string;
    sent_at: string | null;
    paid_at: string | null;
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
    items: InvoiceItem[];
    creator: {
        name: string;
    };
}

interface InvoiceShowProps {
    invoice: Invoice;
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

export default function InvoiceShow() {
    const pageProps = usePage().props as unknown as InvoiceShowProps;
    const { invoice } = pageProps;
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentAmount, setPaymentAmount] = useState(invoice.due_amount);
    const { post, processing } = useForm({});

    const { post: postPayment, processing: processingPayment } = useForm({
        amount: invoice.due_amount,
    });

    const handlePayment = () => {
        postPayment(`/invoices/${invoice.id}/pay`, {
            onSuccess: () => setShowPaymentModal(false),
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Factura ${invoice.invoice_number}`} />
            
            <div className="min-h-screen bg-slate-950">
                <header className="bg-slate-900 border-b border-slate-800 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <a href="/invoices" className="text-slate-400 hover:text-white">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </a>
                            <div>
                                <h1 className="text-2xl font-bold text-white">{invoice.invoice_number}</h1>
                                <span className={`px-3 py-1 rounded-full text-xs ${statusColors[invoice.status]}`}>
                                    {invoice.status}
                                </span>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                                <a
                                    href={`https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=${encodeURIComponent(invoice.client.user.email)}&item_name=${encodeURIComponent(`Factura ${invoice.invoice_number}`)}&amount=${invoice.due_amount}&currency_code=USD`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 bg-[#0070ba] text-white rounded-lg hover:bg-[#005ea6] flex items-center gap-2"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.72a.771.771 0 0 1 .76-.65h6.692c3.146 0 5.336 2.146 4.926 5.256-.458 3.472-3.528 5.69-6.959 5.69H8.08l-1.152 4.676a.641.641 0 0 1-.628.545zm6.092-11.464c-.322 0-.61.152-.803.423-.197.275-.253.628-.154.968.405 1.374 1.308 2.585 2.492 3.346.568.366 1.218.558 1.87.558.825 0 1.525-.382 1.952-1.064.427-.68.562-1.545.378-2.423-.367-1.73-1.553-3.138-3.298-3.138h-.503c-.457 0-.87.217-1.145.602-.274.385-.355.88-.225 1.38.13.5.464.9.93.9z"/>
                                    </svg>
                                    Pagar con PayPal
                                </a>
                            )}
                            <a
                                href={`/invoices/${invoice.id}/pdf`}
                                target="_blank"
                                className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                Descargar PDF
                            </a>
                            {invoice.status !== 'paid' && invoice.status !== 'cancelled' && (
                                <button
                                    onClick={() => setShowPaymentModal(true)}
                                    className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500"
                                >
                                    Registrar Pago
                                </button>
                            )}
                            {invoice.status === 'draft' && (
                                <button
                                    onClick={() => post(`/invoices/${invoice.id}/send`)}
                                    disabled={processing}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 disabled:opacity-50"
                                >
                                    Enviar al Cliente
                                </button>
                            )}
                        </div>
                    </div>
                </header>

                <div className="p-8">
                    <div className="grid grid-cols-3 gap-6 mb-8">
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                            <h3 className="text-slate-400 text-sm mb-1">Cliente</h3>
                            <p className="text-white font-medium">{invoice.client.company_name || invoice.client.user?.name || 'Cliente sin nombre'}</p>
                            <p className="text-slate-400 text-sm">{invoice.client.user?.email}</p>
                        </div>
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                            <h3 className="text-slate-400 text-sm mb-1">Fechas</h3>
                            <p className="text-white">Emisión: {new Date(invoice.issue_date).toLocaleDateString()}</p>
                            <p className="text-white">Vencimiento: {new Date(invoice.due_date).toLocaleDateString()}</p>
                        </div>
                        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                            <h3 className="text-slate-400 text-sm mb-1">Montos</h3>
                            <p className="text-white">Total: <span className="font-bold">${Number(invoice.total).toFixed(2)}</span></p>
                            <p className="text-emerald-400">Pagado: ${Number(invoice.paid_amount).toFixed(2)}</p>
                            <p className="text-orange-400">Pendiente: ${Number(invoice.due_amount).toFixed(2)}</p>
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
                                {invoice.items.map((item) => (
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
                                    <span className="text-white">${Number(invoice.subtotal).toFixed(2)}</span>
                                </div>
                                {invoice.tax_rate > 0 && (
                                    <div className="flex justify-between text-slate-400">
                                        <span>Impuesto ({invoice.tax_rate}%)</span>
                                        <span className="text-white">${Number(invoice.tax_amount).toFixed(2)}</span>
                                    </div>
                                )}
                                {invoice.discount > 0 && (
                                    <div className="flex justify-between text-slate-400">
                                        <span>Descuento</span>
                                        <span className="text-emerald-400">-${Number(invoice.discount).toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="pt-3 border-t border-slate-700 flex justify-between text-lg font-bold">
                                    <span className="text-white">Total</span>
                                    <span className="text-cyan-400">${Number(invoice.total).toFixed(2)}</span>
                                </div>
                                {invoice.paid_amount > 0 && (
                                    <>
                                        <div className="flex justify-between text-slate-400">
                                            <span>Pagado</span>
                                            <span className="text-emerald-400">-${Number(invoice.paid_amount).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-xl font-bold">
                                            <span className="text-white">Pendiente</span>
                                            <span className="text-orange-400">${Number(invoice.due_amount).toFixed(2)}</span>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {(invoice.notes || invoice.terms) && (
                        <div className="grid grid-cols-2 gap-6 mt-8">
                            {invoice.notes && (
                                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                                    <h3 className="text-white font-medium mb-2">Notas</h3>
                                    <p className="text-slate-400 text-sm">{invoice.notes}</p>
                                </div>
                            )}
                            {invoice.terms && (
                                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6">
                                    <h3 className="text-white font-medium mb-2">Términos de Pago</h3>
                                    <p className="text-slate-400 text-sm">{invoice.terms}</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Payment Modal */}
                {showPaymentModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-800">
                            <h3 className="text-xl font-bold text-white mb-4">Registrar Pago</h3>
                            <p className="text-slate-400 mb-4">
                                Monto pendiente: <span className="text-white font-bold">${Number(invoice.due_amount).toFixed(2)}</span>
                            </p>
                            <form onSubmit={(e) => { e.preventDefault(); handlePayment(); }}>
                                <input type="hidden" name="amount" value={paymentAmount} />
                                <div className="mb-4">
                                    <label className="block text-slate-400 text-sm mb-1">Monto del pago</label>
                                    <input
                                        type="number"
                                        name="amount"
                                        value={paymentAmount}
                                        onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                                        min="0"
                                        step="0.01"
                                        max={invoice.due_amount}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    />
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setShowPaymentModal(false)}
                                        className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processingPayment}
                                        className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-500 disabled:opacity-50"
                                    >
                                        Confirmar Pago
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
