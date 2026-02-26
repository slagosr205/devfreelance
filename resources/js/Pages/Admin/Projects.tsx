import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Project {
    id: number;
    client_id: number;
    name: string;
    description: string | null;
    type: string;
    status: string;
    budget: number | null;
    start_date: string | null;
    end_date: string | null;
    requirements: string | null;
    created_at: string;
    client: {
        id: number;
        company_name: string | null;
        user: {
            name: string;
            email: string;
        };
    };
}

interface ProjectsPageProps {
    projects: {
        data: Project[];
        current_page: number;
        last_page: number;
        total: number;
    };
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/20 text-yellow-400',
    in_progress: 'bg-blue-500/20 text-blue-400',
    completed: 'bg-emerald-500/20 text-emerald-400',
    cancelled: 'bg-red-500/20 text-red-400',
    on_hold: 'bg-gray-500/20 text-gray-400',
};

const typeLabels: Record<string, string> = {
    sap_b1: 'SAP Business One',
    odoo: 'Odoo ERP',
    custom: 'Desarrollo Personalizado',
    integration: 'Integración',
    consulting: 'Consultoría',
};

export default function AdminProjects() {
    const pageProps = usePage().props as unknown as ProjectsPageProps;
    const { projects } = pageProps;
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const { data, setData, post, patch, reset } = useForm({
        client_id: '',
        name: '',
        description: '',
        type: 'custom',
        status: 'pending',
        budget: '',
        start_date: '',
        end_date: '',
        requirements: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingProject) {
            patch(`/admin/projects/${editingProject.id}`, {
                onSuccess: () => {
                    setShowModal(false);
                    setEditingProject(null);
                    reset();
                },
            });
        }
    };

    const openEdit = (project: Project) => {
        setEditingProject(project);
        setData({
            client_id: project.client_id.toString(),
            name: project.name,
            description: project.description || '',
            type: project.type,
            status: project.status,
            budget: project.budget?.toString() || '',
            start_date: project.start_date || '',
            end_date: project.end_date || '',
            requirements: project.requirements || '',
        });
        setShowModal(true);
    };

    return (
        <AuthenticatedLayout>
            <Head title="Admin - Proyectos" />
            
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white">Proyectos</h1>
                    <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-800/50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Proyecto</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Cliente</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Tipo</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Estado</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Presupuesto</th>
                                    <th className="px-6 py-4 text-left text-slate-400 font-medium">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {projects.data.map((project) => (
                                    <tr key={project.id} className="hover:bg-slate-800/30">
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-white font-medium">{project.name}</p>
                                                <p className="text-slate-500 text-sm">{project.description?.substring(0, 50)}...</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">{project.client.user.name}</td>
                                        <td className="px-6 py-4 text-slate-300">{typeLabels[project.type] || project.type}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs ${statusColors[project.status]}`}>
                                                {project.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-slate-300">
                                            {project.budget ? `$${Number(project.budget).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => openEdit(project)}
                                                className="text-cyan-400 hover:text-cyan-300"
                                            >
                                                Editar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {projects.data.length === 0 && (
                            <div className="text-center py-12 text-slate-500">
                                No hay proyectos registrados
                            </div>
                        )}
                    </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-lg border border-slate-800 max-h-[90vh] overflow-y-auto">
                            <h3 className="text-xl font-bold text-white mb-4">Editar Proyecto</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
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
                                    <label className="block text-slate-400 text-sm mb-1">Descripción</label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1">Tipo</label>
                                        <select
                                            value={data.type}
                                            onChange={(e) => setData('type', e.target.value)}
                                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                        >
                                            <option value="sap_b1">SAP Business One</option>
                                            <option value="odoo">Odoo ERP</option>
                                            <option value="custom">Desarrollo Personalizado</option>
                                            <option value="integration">Integración</option>
                                            <option value="consulting">Consultoría</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1">Estado</label>
                                        <select
                                            value={data.status}
                                            onChange={(e) => setData('status', e.target.value)}
                                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                        >
                                            <option value="pending">Pendiente</option>
                                            <option value="in_progress">En Progreso</option>
                                            <option value="completed">Completado</option>
                                            <option value="on_hold">En Espera</option>
                                            <option value="cancelled">Cancelado</option>
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Presupuesto ($)</label>
                                    <input
                                        type="number"
                                        value={data.budget}
                                        onChange={(e) => setData('budget', e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1">Fecha Inicio</label>
                                        <input
                                            type="date"
                                            value={data.start_date}
                                            onChange={(e) => setData('start_date', e.target.value)}
                                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1">Fecha Fin</label>
                                        <input
                                            type="date"
                                            value={data.end_date}
                                            onChange={(e) => setData('end_date', e.target.value)}
                                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Requisitos</label>
                                    <textarea
                                        value={data.requirements}
                                        onChange={(e) => setData('requirements', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingProject(null);
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
                                        Actualizar
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
