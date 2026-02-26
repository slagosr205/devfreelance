import { Head, useForm, usePage } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Project {
    id: number;
    name: string;
    description: string | null;
    type: string;
    status: string;
    budget: number | null;
    start_date: string | null;
    end_date: string | null;
    requirements: string | null;
    created_at: string;
    payments: {
        id: number;
        amount: number;
        status: string;
    }[];
}

interface Client {
    id: number;
    company_name: string | null;
    status: string;
}

interface ClientProjectsPageProps {
    projects: Project[];
    client: Client;
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

export default function ClientProjects() {
    const pageProps = usePage().props as unknown as ClientProjectsPageProps;
    const { projects, client } = pageProps;
    const [showModal, setShowModal] = useState(false);
    const { data, setData, post, reset } = useForm({
        name: '',
        description: '',
        type: 'custom',
        requirements: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/my-projects', {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title="Mis Proyectos" />
            
            <div className="space-y-6">
                <h1 className="text-2xl font-bold text-white">Mis Proyectos</h1>
                    {client && (
                        <div className="mb-6 bg-slate-900 rounded-xl p-4 border border-slate-800">
                            <p className="text-slate-400">
                                Empresa: <span className="text-white">{client.company_name || 'No registrada'}</span>
                            </p>
                        </div>
                    )}

                    <div className="grid gap-6">
                        {projects.map((project) => (
                            <div key={project.id} className="bg-slate-900 rounded-2xl p-6 border border-slate-800">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{project.name}</h3>
                                        <p className="text-slate-400 mt-1">{project.description}</p>
                                        <div className="flex gap-4 mt-4">
                                            <span className="text-slate-500">
                                                <span className="text-slate-400">Tipo:</span> {typeLabels[project.type] || project.type}
                                            </span>
                                            <span className="text-slate-500">
                                                <span className="text-slate-400">Presupuesto:</span> ${project.budget ? Number(project.budget).toLocaleString('en-US', { minimumFractionDigits: 2 }) : 'A definir'}
                                            </span>
                                        </div>
                                    </div>
                                    <span className={`px-4 py-2 rounded-full text-sm ${statusColors[project.status]}`}>
                                        {project.status.replace('_', ' ')}
                                    </span>
                                </div>
                                {project.start_date && (
                                    <div className="mt-4 pt-4 border-t border-slate-800 text-slate-500 text-sm">
                                        Inicio: {new Date(project.start_date).toLocaleDateString()}
                                        {project.end_date && ` - Fin: ${new Date(project.end_date).toLocaleDateString()}`}
                                    </div>
                                )}
                            </div>
                        ))}
                        {projects.length === 0 && (
                            <div className="text-center py-12 bg-slate-900 rounded-2xl border border-slate-800">
                                <p className="text-slate-500">No tienes proyectos aún</p>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="mt-4 text-cyan-400 hover:text-cyan-300"
                                >
                                    Solicitar tu primer proyecto
                                </button>
                            </div>
                        )}
                    </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-lg border border-slate-800">
                            <h3 className="text-xl font-bold text-white mb-4">Solicitar Nuevo Proyecto</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Nombre del Proyecto *</label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                        required
                                        placeholder="Ej: Sistema de inventario para mi empresa"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Descripción</label>
                                    <textarea
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                        placeholder="Describe brevemente tu proyecto"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Tipo de Proyecto *</label>
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
                                    <label className="block text-slate-400 text-sm mb-1">Requisitos o Necesidades</label>
                                    <textarea
                                        value={data.requirements}
                                        onChange={(e) => setData('requirements', e.target.value)}
                                        rows={4}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                        placeholder="Describe los requisitos específicos que necesitas..."
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false);
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
                                        Enviar Solicitud
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
