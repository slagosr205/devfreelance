import { Head, usePage } from '@inertiajs/react';

interface Post {
    id: number;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    image: string | null;
    category: string | null;
    published_at: string;
    user: { name: string } | null;
}

interface BlogShowProps {
    post: Post;
    relatedPosts: Post[];
}

export default function BlogShow() {
    const pageProps = usePage().props as unknown as BlogShowProps;
    const { post, relatedPosts } = pageProps;

    return (
        <>
            <Head title={`${post.title} | Blog`} />
            
            <div className="min-h-screen bg-slate-950">
                <article>
                    {post.image && (
                        <div className="relative h-64 md:h-96 overflow-hidden">
                            <img
                                src={post.image}
                                alt={post.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent"></div>
                        </div>
                    )}

                    <div className="max-w-4xl mx-auto px-6 py-12">
                        <a
                            href="/blog"
                            className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-6"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Volver al Blog
                        </a>

                        {post.category && (
                            <span className="inline-block px-3 py-1 bg-cyan-600/20 text-cyan-400 text-sm font-medium rounded-full mb-4">
                                {post.category}
                            </span>
                        )}

                        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-4 text-slate-400 mb-8 pb-8 border-b border-slate-800">
                            {post.user && (
                                <span className="flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    {post.user.name}
                                </span>
                            )}
                            <span className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {new Date(post.published_at).toLocaleDateString('es-ES', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                            </span>
                        </div>

                        <div
                            className="prose prose-invert prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: post.content }}
                        />
                    </div>
                </article>

                {relatedPosts.length > 0 && (
                    <div className="border-t border-slate-800">
                        <div className="max-w-7xl mx-auto px-6 py-12">
                            <h2 className="text-2xl font-bold text-white mb-6">Artículos Relacionados</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {relatedPosts.map((related) => (
                                    <a
                                        key={related.id}
                                        href={`/blog/${related.slug}`}
                                        className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden hover:border-cyan-500/50 transition-all group"
                                    >
                                        {related.image && (
                                            <div className="aspect-video overflow-hidden">
                                                <img
                                                    src={related.image}
                                                    alt={related.title}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            </div>
                                        )}
                                        <div className="p-4">
                                            <h3 className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                                                {related.title}
                                            </h3>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
