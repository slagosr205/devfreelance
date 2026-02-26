import { Head, useForm, usePage, Link } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface User {
    id: number;
    name: string;
    email: string;
    is_admin: boolean;
    created_at: string;
    client: {
        id: number;
        status: string;
    } | null;
}

interface UsersPageProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        total: number;
    };
    flash?: {
        success?: string;
        error?: string;
    };
}

export default function AdminUsers() {
    const pageProps = usePage().props as unknown as UsersPageProps;
    const { users, flash } = pageProps;
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    
    const { data, setData, post, put, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const handleCreate = (e: React.FormEvent) => {
        e.preventDefault();
        post('/admin/users', {
            onSuccess: () => {
                setShowCreateModal(false);
                reset();
            },
        });
    };

    const openEditModal = (user: User) => {
        setEditingUser(user);
        setData({
            name: user.name,
            email: user.email,
            password: '',
            password_confirmation: '',
        });
        setShowEditModal(true);
    };

    const handleUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingUser) {
            put(`/admin/users/${editingUser.id}`, {
                onSuccess: () => {
                    setShowEditModal(false);
                    setEditingUser(null);
                    reset();
                },
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Admin - Usuarios" />
            
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white">Usuarios</h1>
                    {flash?.success && (
                        <div className="mb-4 p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-xl text-emerald-400">
                            {flash.success}
                        </div>
                    )}
                    {flash?.error && (
                        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
                            {flash.error}
                        </div>
                    )}

                    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Usuario</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Rol</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Cliente</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Fecha</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {users.data.map((user) => (
                                    <tr key={user.id} className="hover:bg-slate-800/30">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-white font-medium">{user.name}</p>
                                                <p className="text-slate-500 text-sm">{user.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs ${
                                                user.is_admin 
                                                ? 'bg-violet-500/20 text-violet-400' 
                                                : 'bg-slate-700 text-slate-300'
                                            }`}>
                                                {user.is_admin ? 'Admin' : 'Usuario'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">
                                            {user.client ? (
                                                <span className="text-emerald-400">Registrado</span>
                                            ) : (
                                                <span className="text-slate-500">No registrado</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-slate-400 text-sm">
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => openEditModal(user)}
                                                    className="text-cyan-400 hover:text-cyan-300"
                                                >
                                                    Editar
                                                </button>
                                                {user.is_admin ? (
                                                    <form method="POST" action={`/admin/users/${user.id}/remove-admin`}>
                                                        <input type="hidden" name="_token" value={(document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content} />
                                                        <button type="submit" className="text-red-400 hover:text-red-300">
                                                            Quitar Admin
                                                        </button>
                                                    </form>
                                                ) : (
                                                    <form method="POST" action={`/admin/users/${user.id}/make-admin`}>
                                                        <input type="hidden" name="_token" value={(document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content} />
                                                        <button type="submit" className="text-violet-400 hover:text-violet-300">
                                                            Hacer Admin
                                                        </button>
                                                    </form>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {users.data.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                No hay usuarios registrados
                            </div>
                        )}
                    </div>

                    <div className="flex justify-between items-center">
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); setShowCreateModal(true); }}
                            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-lg hover:opacity-90"
                        >
                            + Crear Usuario
                        </a>
                    </div>

                {showCreateModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-800">
                            <h3 className="text-xl font-bold text-white mb-4">Crear Nuevo Usuario</h3>
                            <form onSubmit={handleCreate} className="space-y-4">
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Nombre</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                        required
                                        placeholder="Nombre completo"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Correo electrónico</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                        required
                                        placeholder="email@ejemplo.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Contraseña</label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                        required
                                        placeholder="Mínimo 8 caracteres"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Confirmar Contraseña</label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                        required
                                        placeholder="Repite la contraseña"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowCreateModal(false);
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
                                        Crear Usuario
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {showEditModal && editingUser && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-800">
                            <h3 className="text-xl font-bold text-white mb-4">Editar Usuario</h3>
                            <form onSubmit={handleUpdate} className="space-y-4">
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Nombre</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Correo electrónico</label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Nueva Contraseña (opcional)</label>
                                    <input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                        placeholder="Dejar vacío para mantener"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Confirmar Contraseña</label>
                                    <input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                        placeholder="Repite la contraseña"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowEditModal(false);
                                            setEditingUser(null);
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
                                        Guardar Cambios
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
