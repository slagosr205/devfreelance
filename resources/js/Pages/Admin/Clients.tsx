import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Client {
    id: number;
    user_id: number;
    company_name: string | null;
    phone: string | null;
    country: string | null;
    city: string | null;
    status: string;
    notes: string | null;
    created_at: string;
    user: {
        id: number;
        name: string;
        email: string;
    };
    projects_count?: number;
    payments_sum?: number;
}

interface ClientsPageProps {
    clients: {
        data: Client[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

const statusColors: Record<string, string> = {
    active: 'bg-emerald-500/20 text-emerald-400',
    inactive: 'bg-gray-500/20 text-gray-400',
    prospect: 'bg-violet-500/20 text-violet-400',
};

export default function AdminClients() {
    const pageProps = usePage().props as unknown as ClientsPageProps;
    const { clients } = pageProps;
    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState<Client | null>(null);
    const { data, setData, post, patch, reset } = useForm({
        user_id: '',
        company_name: '',
        phone: '',
        country: '',
        city: '',
        notes: '',
        status: 'prospect',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingClient) {
            patch(`/admin/clients/${editingClient.id}`, {
                onSuccess: () => {
                    setShowModal(false);
                    setEditingClient(null);
                    reset();
                },
            });
        } else {
            post('/admin/clients', {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                },
            });
        }
    };

    const openEdit = (client: Client) => {
        setEditingClient(client);
        setData({
            user_id: client.user_id.toString(),
            company_name: client.company_name || '',
            phone: client.phone || '',
            country: client.country || '',
            city: client.city || '',
            notes: client.notes || '',
            status: client.status,
        });
        setShowModal(true);
    };

    const enableClientAccess = (clientId: number) => {
        if (confirm('¿Habilitar acceso al portal para este cliente?')) {
            post(`/admin/clients/${clientId}/enable-access`);
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Admin - Clientes" />
            
            <div className="space-y-6">
                <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Cliente</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Empresa</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">País</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Estado</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Fecha</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {clients.data.map((client) => (
                                    <tr key={client.id} className="hover:bg-slate-800/30">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-white font-medium">{client.user.name}</p>
                                                <p className="text-slate-500 text-sm">{client.user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">{client.company_name || '-'}</td>
                                        <td className="px-6 py-4 text-slate-300">{client.country || '-'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs ${statusColors[client.status]}`}>
                                                {client.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">
                                            {new Date(client.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => enableClientAccess(client.id)}
                                                    className="text-emerald-400 hover:text-emerald-300 text-sm"
                                                >
                                                    Habilitar Acceso
                                                </button>
                                                <button
                                                    onClick={() => openEdit(client)}
                                                    className="text-cyan-400 hover:text-cyan-300"
                                                >
                                                    Editar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {clients.data.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                No hay clientes registrados
                            </div>
                        )}
                    </div>

                {/* Modal */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-800">
                            <h3 className="text-xl font-bold text-white mb-4">
                                {editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Empresa</label>
                                    <input
                                        type="text"
                                        value={data.company_name}
                                        onChange={(e) => setData('company_name', e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Teléfono</label>
                                    <input
                                        type="text"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1">País</label>
                                        <input
                                            type="text"
                                            value={data.country}
                                            onChange={(e) => setData('country', e.target.value)}
                                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1">Ciudad</label>
                                        <input
                                            type="text"
                                            value={data.city}
                                            onChange={(e) => setData('city', e.target.value)}
                                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Estado</label>
                                    <select
                                        value={data.status}
                                        onChange={(e) => setData('status', e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    >
                                        <option value="prospect">Prospecto</option>
                                        <option value="active">Activo</option>
                                        <option value="inactive">Inactivo</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Notas</label>
                                    <textarea
                                        value={data.notes}
                                        onChange={(e) => setData('notes', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingClient(null);
                                            reset();
                                        }}
                                        className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-lg hover:opacity-90"
                                    >
                                        {editingClient ? 'Actualizar' : 'Crear'}
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
