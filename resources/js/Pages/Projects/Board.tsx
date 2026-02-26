import { Head, useForm, usePage, router } from '@inertiajs/react';
import { useState } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

interface Task {
    id: number;
    stage_id?: number;
    title: string;
    description: string | null;
    priority: string;
    status: string;
    order: number;
    estimated_hours: number | null;
    due_date: string | null;
    assignee: {
        id: number;
        name: string;
    } | null;
}

interface Stage {
    id: number;
    name: string;
    color: string;
    order: number;
    is_final: boolean;
    tasks: Task[];
}

interface Activity {
    id: number;
    description: string;
    created_at: string;
    user: {
        name: string;
    };
}

interface Project {
    id: number;
    name: string;
    description: string | null;
    status: string;
    client: {
        company_name: string | null;
        user: {
            name: string;
        };
    };
    stages: Stage[];
    activities: Activity[];
}

interface ProjectShowProps {
    project: Project;
}

const priorityColors: Record<string, string> = {
    low: 'bg-slate-500/20 text-slate-400',
    medium: 'bg-blue-500/20 text-blue-400',
    high: 'bg-orange-500/20 text-orange-400',
    urgent: 'bg-red-500/20 text-red-400',
};

const statusIcons: Record<string, string> = {
    todo: '📋',
    in_progress: '🔄',
    review: '👀',
    done: '✅',
    blocked: '🚫',
};

export default function ProjectBoard() {
    const pageProps = usePage().props as unknown as ProjectShowProps;
    const { project } = pageProps;
    
    const [stages, setStages] = useState<Stage[]>(project.stages);
    const [draggedTask, setDraggedTask] = useState<{ task: Task; stageId: number } | null>(null);
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showStageModal, setShowStageModal] = useState(false);
    const [selectedStage, setSelectedStage] = useState<Stage | null>(null);
    const [activeTab, setActiveTab] = useState<'board' | 'activity'>('board');

    const { post: postTask, processing: processingTask, data: taskData, setData: setTaskData } = useForm({
        stage_id: 0,
        title: '',
        description: '',
        priority: 'medium',
        assigned_to: '',
        estimated_hours: '',
        due_date: '',
    });

    const handleDragStart = (task: Task, stageId: number) => {
        setDraggedTask({ task, stageId });
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (targetStageId: number) => {
        if (!draggedTask) return;
        
        const sourceStageId = draggedTask.stageId;
        
        if (sourceStageId === targetStageId) {
            setDraggedTask(null);
            return;
        }

        const sourceStage = stages.find(s => s.id === sourceStageId);
        const targetStage = stages.find(s => s.id === targetStageId);
        
        if (!sourceStage || !targetStage) {
            setDraggedTask(null);
            return;
        }

        const taskOrder = targetStage.tasks.length;

        setStages(prev => prev.map(stage => {
            if (stage.id === sourceStageId) {
                return {
                    ...stage,
                    tasks: stage.tasks.filter(t => t.id !== draggedTask.task.id)
                };
            }
            if (stage.id === targetStageId) {
                return {
                    ...stage,
                    tasks: [...stage.tasks, { ...draggedTask.task, stage_id: targetStageId }]
                };
            }
            return stage;
        }));

        router.put(`/projects-board/tasks/${draggedTask.task.id}/move`, {
            stage_id: targetStageId,
            order: taskOrder,
        });

        setDraggedTask(null);
    };

    const { post: postStage, processing: processingStage, data: stageData, setData: setStageData } = useForm({
        name: '',
        color: '#6b7280',
        is_final: false,
    });

    const handleCreateTask = (stageId: number) => {
        setSelectedStage(project.stages.find(s => s.id === stageId) || null);
        setTaskData('stage_id', stageId);
        setShowTaskModal(true);
    };

    const submitTask = (e: React.FormEvent) => {
        e.preventDefault();
        postTask(`/projects-board/${project.id}/tasks`, {
            onSuccess: () => {
                setShowTaskModal(false);
            },
        });
    };

    const submitStage = (e: React.FormEvent) => {
        e.preventDefault();
        postStage(`/projects-board/${project.id}/stages`, {
            onSuccess: () => {
                setShowStageModal(false);
            },
        });
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Proyecto: ${project.name}`} />
            
            <div className="min-h-screen bg-slate-950">
                <header className="bg-slate-900 border-b border-slate-800 px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <a href="/projects-board" className="text-slate-400 hover:text-white">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </a>
                            <div>
                                <h1 className="text-2xl font-bold text-white">{project.name}</h1>
                                <p className="text-slate-400 text-sm">
                                    {project.client?.company_name || project.client?.user?.name || 'Cliente sin nombre'}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowStageModal(true)}
                                className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
                            >
                                + Nueva Etapa
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex gap-4 mt-4">
                        <button
                            onClick={() => setActiveTab('board')}
                            className={`px-4 py-2 rounded-lg ${activeTab === 'board' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            Tablero
                        </button>
                        <button
                            onClick={() => setActiveTab('activity')}
                            className={`px-4 py-2 rounded-lg ${activeTab === 'activity' ? 'bg-cyan-600 text-white' : 'text-slate-400 hover:text-white'}`}
                        >
                            Actividad
                        </button>
                    </div>
                </header>

                {activeTab === 'board' ? (
                    <div className="p-8 overflow-x-auto">
                        <div className="flex gap-6 min-w-max">
                            {stages.sort((a, b) => a.order - b.order).map((stage) => (
                                <div key={stage.id} className="w-80 flex-shrink-0">
                                    <div 
                                        className="bg-slate-900 rounded-xl border border-slate-800"
                                        style={{ borderTopColor: stage.color, borderTopWidth: '3px' }}
                                    >
                                        <div className="p-4 border-b border-slate-800">
                                            <div className="flex items-center justify-between">
                                                <h3 className="font-semibold text-white">{stage.name}</h3>
                                                <span className="text-slate-500 text-sm">
                                                    {stage.tasks.length}
                                                </span>
                                            </div>
                                        </div>
                                        
                                        <div 
                                            className="p-3 space-y-3 min-h-[200px] max-h-[calc(100vh-300px)] overflow-y-auto"
                                            onDragOver={handleDragOver}
                                            onDrop={() => handleDrop(stage.id)}
                                        >
                                            {stage.tasks.sort((a, b) => a.order - b.order).map((task) => (
                                                <div
                                                    key={task.id}
                                                    draggable
                                                    onDragStart={() => handleDragStart(task, stage.id)}
                                                    className="bg-slate-800/50 rounded-lg p-4 hover:bg-slate-800 transition-colors cursor-grab active:cursor-grabbing"
                                                >
                                                    <div className="flex items-start justify-between mb-2">
                                                        <span className="text-sm">{statusIcons[task.status]}</span>
                                                        <span className={`px-2 py-0.5 rounded-full text-xs ${priorityColors[task.priority]}`}>
                                                            {task.priority}
                                                        </span>
                                                    </div>
                                                    <h4 className="text-white font-medium text-sm">{task.title}</h4>
                                                    {task.description && (
                                                        <p className="text-slate-500 text-xs mt-1 line-clamp-2">
                                                            {task.description}
                                                        </p>
                                                    )}
                                                    <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
                                                        {task.assignee && (
                                                            <span>{task.assignee.name}</span>
                                                        )}
                                                        {task.due_date && (
                                                            <span>{new Date(task.due_date).toLocaleDateString()}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        
                                        <div className="p-3 border-t border-slate-800 space-y-2">
                                            {stage.is_final && (
                                                <button
                                                    onClick={() => {
                                                        if (confirm('¿Generar factura desde la cotización aceptada del proyecto?')) {
                                                            router.post(`/projects-board/${project.id}/generate-invoice`);
                                                        }
                                                    }}
                                                    className="w-full text-center text-cyan-400 hover:text-cyan-300 text-sm py-2 bg-cyan-500/10 rounded-lg"
                                                >
                                                    Generar Factura
                                                </button>
                                            )}
                                            <button
                                                onClick={() => handleCreateTask(stage.id)}
                                                className="w-full text-center text-slate-500 hover:text-white text-sm py-2"
                                            >
                                                + Agregar tarea
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            
                            {project.stages.length === 0 && (
                                <div className="text-center py-12 text-slate-500">
                                    No hay etapas todavía. Crea una para comenzar.
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="p-8">
                        <div className="max-w-3xl">
                            <h2 className="text-lg font-semibold text-white mb-4">Historial de Actividad</h2>
                            <div className="space-y-4">
                                {project.activities.map((activity) => (
                                    <div key={activity.id} className="bg-slate-900 rounded-lg p-4 border border-slate-800">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-white">{activity.description}</p>
                                                <p className="text-slate-500 text-sm mt-1">
                                                    {activity.user.name} • {new Date(activity.created_at).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {project.activities.length === 0 && (
                                    <p className="text-slate-500 text-center py-8">No hay actividad registrada</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* New Task Modal */}
                {showTaskModal && selectedStage && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-800">
                            <h3 className="text-xl font-bold text-white mb-4">
                                Nueva Tarea en {selectedStage.name}
                            </h3>
                            <form onSubmit={submitTask} className="space-y-4">
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Título *</label>
                                    <input
                                        type="text"
                                        value={taskData.title}
                                        onChange={(e) => setTaskData('title', e.target.value)}
                                        required
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Descripción</label>
                                    <textarea
                                        value={taskData.description}
                                        onChange={(e) => setTaskData('description', e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1">Prioridad</label>
                                        <select
                                            value={taskData.priority}
                                            onChange={(e) => setTaskData('priority', e.target.value)}
                                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                        >
                                            <option value="low">Baja</option>
                                            <option value="medium">Media</option>
                                            <option value="high">Alta</option>
                                            <option value="urgent">Urgente</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-1">Horas estimadas</label>
                                        <input
                                            type="number"
                                            value={taskData.estimated_hours}
                                            onChange={(e) => setTaskData('estimated_hours', e.target.value)}
                                            min="0"
                                            className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Fecha de vencimiento</label>
                                    <input
                                        type="date"
                                        value={taskData.due_date}
                                        onChange={(e) => setTaskData('due_date', e.target.value)}
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    />
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowTaskModal(false)}
                                        className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processingTask}
                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                                    >
                                        Crear Tarea
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* New Stage Modal */}
                {showStageModal && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-slate-900 rounded-2xl p-6 w-full max-w-md border border-slate-800">
                            <h3 className="text-xl font-bold text-white mb-4">Nueva Etapa</h3>
                            <form onSubmit={submitStage} className="space-y-4">
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Nombre *</label>
                                    <input
                                        type="text"
                                        value={stageData.name}
                                        onChange={(e) => setStageData('name', e.target.value)}
                                        required
                                        placeholder="Ej: Por hacer, En progreso, Completado"
                                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-slate-400 text-sm mb-1">Color</label>
                                    <div className="flex gap-3">
                                        {['#6b7280', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'].map((color) => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => setStageData('color', color)}
                                                className={`w-8 h-8 rounded-full ${stageData.color === color ? 'ring-2 ring-white' : ''}`}
                                                style={{ backgroundColor: color }}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="is_final"
                                        checked={stageData.is_final}
                                        onChange={(e) => setStageData('is_final', e.target.checked)}
                                        className="w-4 h-4 rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                                    />
                                    <label htmlFor="is_final" className="text-slate-300 text-sm">
                                        Etapa final (al completar se puede generar factura)
                                    </label>
                                </div>
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowStageModal(false)}
                                        className="flex-1 px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={processingStage}
                                        className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-lg hover:opacity-90 disabled:opacity-50"
                                    >
                                        Crear Etapa
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
