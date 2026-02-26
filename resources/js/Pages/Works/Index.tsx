import { Head, usePage } from '@inertiajs/react';

interface Work {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    client: string | null;
    image: string | null;
    images: string[] | null;
    category: string | null;
    link: string | null;
}

interface WorksProps {
    works: Work[];
    categories: string[];
}

export default function WorksIndex() {
    const pageProps = usePage().props as unknown as WorksProps;
    const { works, categories } = pageProps;

    return (
        <>
            <Head title="Trabajos | Portafolio" />
            
            <div className="min-h-screen bg-slate-950">
                <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDI5MzkiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
                    <div className="relative max-w-7xl mx-auto px-6 py-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Trabajos</h1>
                        <p className="text-xl text-slate-400 max-w-2xl">
                            Proyectos y desarrollos realizados para clientes
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-12">
                    {categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-8">
                            <button className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm font-medium">
                                Todos
                            </button>
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    )}

                    {works.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-slate-400 text-lg">No hay proyectos publicados aún.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {works.map((work) => (
                                <a
                                    key={work.id}
                                    href={`/works/${work.slug}`}
                                    className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden hover:border-cyan-500/50 transition-all group"
                                >
                                    <div className="aspect-video overflow-hidden relative">
                                        {work.image ? (
                                            <img
                                                src={work.image}
                                                alt={work.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                                                <svg className="w-16 h-16 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <span className="text-white font-medium">Ver proyecto</span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        {work.category && (
                                            <span className="text-xs font-medium text-cyan-400 uppercase tracking-wider">
                                                {work.category}
                                            </span>
                                        )}
                                        <h2 className="text-xl font-bold text-white mt-2 group-hover:text-cyan-400 transition-colors">
                                            {work.title}
                                        </h2>
                                        {work.client && (
                                            <p className="text-slate-400 text-sm mt-1">
                                                Cliente: {work.client}
                                            </p>
                                        )}
                                        {work.description && (
                                            <p className="text-slate-400 text-sm mt-2 line-clamp-2">
                                                {work.description}
                                            </p>
                                        )}
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
