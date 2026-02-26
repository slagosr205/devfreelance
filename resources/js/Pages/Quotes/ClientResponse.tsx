import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';

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
    valid_until: string;
    items: QuoteItem[];
}

interface QuoteShowProps {
    quote: Quote;
    accepted: boolean;
}

const statusColors: Record<string, string> = {
    draft: 'bg-slate-500/20 text-slate-400',
    sent: 'bg-blue-500/20 text-blue-400',
    viewed: 'bg-amber-500/20 text-amber-400',
    accepted: 'bg-emerald-500/20 text-emerald-400',
    rejected: 'bg-red-500/20 text-red-400',
};

export default function ClientResponse({ quote, accepted }: QuoteShowProps) {
    return (
        <GuestLayout>
            <Head title={accepted ? 'Cotización Aprobada' : 'Cotización Rechazada'} />
            
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
                <div className="max-w-2xl w-full">
                    {accepted ? (
                        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-8 text-center">
                            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-4">¡Cotización Aprobada!</h1>
                            <p className="text-slate-400 mb-6">
                                Has aprobado la cotización #{quote.quote_number}. Nos pondremos en contacto contigo pronto para iniciar el proyecto.
                            </p>
                        </div>
                    ) : (
                        <div className="bg-slate-900 border border-red-500/30 rounded-2xl p-8 text-center">
                            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <svg className="w-10 h-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-4">Cotización Rechazada</h1>
                            <p className="text-slate-400 mb-6">
                                Has rechazado la cotización #{quote.quote_number}. Si tienes alguna pregunta, no dudes en contactarnos.
                            </p>
                        </div>
                    )}
                    
                    <div className="mt-6 text-center">
                        <a href="/" className="text-cyan-400 hover:text-cyan-300">
                            Volver al inicio
                        </a>
                    </div>
                </div>
            </div>
        </GuestLayout>
    );
}
