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
    created_at: string;
}

interface WorkShowProps {
    work: Work;
}

export default function WorkShow() {
    const pageProps = usePage().props as unknown as WorkShowProps;
    const { work } = pageProps;

    const allImages = work.images && work.images.length > 0 
        ? work.images 
        : work.image 
            ? [work.image] 
            : [];

    return (
        <>
            <Head title={`${work.title} | Trabajos`} />
            
            <div className="min-h-screen bg-slate-950">
                <div className="max-w-7xl mx-auto px-6 py-12">
                    <a
                        href="/works"
                        className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-6"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Volver a Trabajos
                    </a>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        <div>
                            {work.category && (
                                <span className="inline-block px-3 py-1 bg-cyan-600/20 text-cyan-400 text-sm font-medium rounded-full mb-4">
                                    {work.category}
                                </span>
                            )}
                            
                            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                                {work.title}
                            </h1>

                            {work.client && (
                                <p className="text-lg text-slate-400 mb-4">
                                    Cliente: <span className="text-white">{work.client}</span>
                                </p>
                            )}

                            {work.description && (
                                <div className="prose prose-invert max-w-none mb-8">
                                    <p className="text-slate-300">{work.description}</p>
                                </div>
                            )}

                            {work.link && (
                                <a
                                    href={work.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-6 py-3 bg-cyan-600 text-white rounded-lg font-medium hover:bg-cyan-500 transition-colors"
                                >
                                    Visitar Sitio
                                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            )}
                        </div>

                        <div>
                            {allImages.length > 0 ? (
                                <div className="space-y-4">
                                    {allImages.map((img, idx) => (
                                        <div key={idx} className="rounded-xl overflow-hidden border border-slate-800">
                                            <img
                                                src={img}
                                                alt={`${work.title} - Imagen ${idx + 1}`}
                                                className="w-full"
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="bg-slate-900 rounded-xl border border-slate-800 aspect-video flex items-center justify-center">
                                    <svg className="w-24 h-24 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
