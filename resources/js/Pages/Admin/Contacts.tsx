import { Head, useForm, usePage, Link, useRemember } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Contact {
    id: number;
    name: string;
    email: string;
    service: string | null;
    message: string;
    contacted: boolean;
    created_at: string;
}

interface ContactsPageProps {
    contacts: {
        data: Contact[];
        current_page: number;
        last_page: number;
        total: number;
    };
    flash?: {
        success?: string;
        quote_id?: number;
    };
}

export default function AdminContacts() {
    const pageProps = usePage().props as unknown as ContactsPageProps;
    const { contacts, flash } = pageProps;
    const [showSuccessModal, setShowSuccessModal] = useState(!!flash?.success);
    const [quoteData, setQuoteData] = useState<{ id: number; clientName: string } | null>(
        flash?.quote_id ? { id: flash.quote_id, clientName: '' } : null
    );
    
    const goToCreateQuote = (contact: Contact) => {
        window.location.href = `/quotes/create?client_email=${encodeURIComponent(contact.email)}&service=${encodeURIComponent(contact.service || '')}`;
    };

    return (
        <AuthenticatedLayout>
            <Head title="Admin - Contactos" />
            
            <div className="space-y-6">
                {flash?.success && (
                    <div className="bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 px-4 py-3 rounded-lg flex items-center gap-3">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{flash.success}</span>
                        <button 
                            onClick={() => setShowSuccessModal(true)}
                            className="ml-auto text-sm underline hover:text-emerald-300"
                        >
                            Ver detalles
                        </button>
                    </div>
                )}

                <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-slate-400 font-medium">Nombre</th>
                                <th className="px-6 py-4 text-left text-slate-400 font-medium">Email</th>
                                <th className="px-6 py-4 text-left text-slate-400 font-medium">Servicio</th>
                                <th className="px-6 py-4 text-left text-slate-400 font-medium">Mensaje</th>
                                <th className="px-6 py-4 text-left text-slate-400 font-medium">Fecha</th>
                                <th className="px-6 py-4 text-left text-slate-400 font-medium">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                            {contacts.data.map((contact) => (
                                <tr key={contact.id} className="hover:bg-slate-800/30">
                                    <td className="px-6 py-4 text-white font-medium">
                                        {contact.name}
                                    </td>
                                    <td className="px-6 py-4 text-slate-300">{contact.email}</td>
                                    <td className="px-6 py-4 text-slate-300">
                                        {contact.service === 'sap' && 'SAP Business One'}
                                        {contact.service === 'odoo' && 'Odoo ERP'}
                                        {contact.service === 'modules' && 'Desarrollo de Módulos'}
                                        {contact.service === 'other' && 'Otro'}
                                        {!contact.service && '-'}
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 text-sm max-w-xs truncate">
                                        {contact.message}
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 text-sm">
                                        {new Date(contact.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-3">
                                            <button
                                                onClick={() => goToCreateQuote(contact)}
                                                className="text-cyan-400 hover:text-cyan-300 text-sm"
                                            >
                                                Generar Cotización
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {contacts.data.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            No hay contactos registrados
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {contacts.last_page > 1 && (
                    <div className="flex justify-center gap-2">
                        {Array.from({ length: contacts.last_page }, (_, i) => i + 1).map((page) => (
                            <Link
                                key={page}
                                href={`/admin/contacts?page=${page}`}
                                className={`px-4 py-2 rounded-lg ${
                                    page === contacts.current_page
                                        ? 'bg-cyan-600 text-white'
                                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                                }`}
                            >
                                {page}
                            </Link>
                        ))}
                    </div>
                )}

                {/* Modal de éxito elegante */}
                {showSuccessModal && flash?.success && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-slate-900 rounded-2xl w-full max-w-lg border border-slate-700 shadow-2xl overflow-hidden">
                            <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 p-1">
                                <div className="bg-slate-900 p-6">
                                    <div className="flex items-center justify-center mb-4">
                                        <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white text-center mb-2">Cotización Creada</h3>
                                    <p className="text-slate-400 text-center mb-6">
                                        La cotización ha sido generada exitosamente. Ahora puedes editarla y enviar al cliente.
                                    </p>
                                    
                                    <div className="bg-slate-800/50 rounded-xl p-4 mb-6">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-slate-400">Eventos disparados:</span>
                                        </div>
                                        <ul className="mt-3 space-y-2">
                                            <li className="flex items-center gap-2 text-slate-300">
                                                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                                                Contacto marcado como procesado
                                            </li>
                                            <li className="flex items-center gap-2 text-slate-300">
                                                <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                                                Cliente asignado a la cotización
                                            </li>
                                            <li className="flex items-center gap-2 text-slate-300">
                                                <span className="w-2 h-2 rounded-full bg-violet-400"></span>
                                                Notificación preparada para envío
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => setShowSuccessModal(false)}
                                            className="flex-1 px-4 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors"
                                        >
                                            Cerrar
                                        </button>
                                        <Link
                                            href={`/quotes/${flash.quote_id}/edit`}
                                            className="flex-1 px-4 py-3 bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-xl hover:opacity-90 transition-opacity text-center"
                                        >
                                            Editar Cotización
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
