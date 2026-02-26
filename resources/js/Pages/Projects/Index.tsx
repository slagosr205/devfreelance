import { Head, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Project {
    id: number;
    name: string;
    description: string | null;
    status: string;
    budget: number | null;
    start_date: string | null;
    end_date: string | null;
    client: {
        id: number;
        company_name: string | null;
        user: {
            name: string;
        };
    };
    stages_count?: number;
    tasks_count?: number;
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
    pending: 'bg-slate-500/20 text-slate-400',
    in_progress: 'bg-blue-500/20 text-blue-400',
    on_hold: 'bg-amber-500/20 text-amber-400',
    completed: 'bg-emerald-500/20 text-emerald-400',
    cancelled: 'bg-red-500/20 text-red-400',
};

export default function ProjectsIndex() {
    const pageProps = usePage().props as unknown as ProjectsPageProps;
    const { projects } = pageProps;

    return (
        <AuthenticatedLayout>
            <Head title="Proyectos" />
            
            <div className="min-h-screen bg-slate-950">
                <header className="bg-slate-900 border-b border-slate-800 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <a href="/dashboard" className="text-slate-400 hover:text-white">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </a>
                            <h1 className="text-2xl font-bold text-white">Proyectos</h1>
                        </div>
                        <a
                            href="/projects-board"
                            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-lg hover:opacity-90"
                        >
                            Tablero Kanban
                        </a>
                    </div>
                </header>

                <div className="p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.data.map((project) => (
                            <a
                                key={project.id}
                                href={`/projects-board/${project.id}`}
                                className="bg-slate-900 rounded-2xl border border-slate-800 p-6 hover:border-cyan-500/50 transition-colors"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white">{project.name}</h3>
                                    <span className={`px-2 py-1 rounded-full text-xs ${statusColors[project.status]}`}>
                                        {project.status}
                                    </span>
                                </div>
                                <p className="text-slate-400 text-sm mb-4 line-clamp-2">
                                    {project.description || 'Sin descripción'}
                                </p>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-500">
                                        {project.client?.company_name || project.client?.user?.name || 'Cliente sin nombre'}
                                    </span>
                                    {project.budget && (
                                        <span className="text-cyan-400 font-medium">
                                            ${Number(project.budget).toFixed(2)}
                                        </span>
                                    )}
                                </div>
                                {(project.start_date || project.end_date) && (
                                    <div className="mt-3 pt-3 border-t border-slate-700 text-xs text-slate-500">
                                        {project.start_date && new Date(project.start_date).toLocaleDateString()}
                                        {project.start_date && project.end_date && ' - '}
                                        {project.end_date && new Date(project.end_date).toLocaleDateString()}
                                    </div>
                                )}
                            </a>
                        ))}
                    </div>
                    
                    {projects.data.length === 0 && (
                        <div className="text-center py-12 text-slate-500">
                            No hay proyectos todavía
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
