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

interface BlogProps {
    posts: {
        data: Post[];
        current_page: number;
        last_page: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    categories: string[];
}

export default function BlogIndex() {
    const pageProps = usePage().props as unknown as BlogProps;
    const { posts, categories } = pageProps;

    return (
        <>
            <Head title="Blog | Artículos y Noticias" />
            
            <div className="min-h-screen bg-slate-950">
                <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDI5MzkiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
                    <div className="relative max-w-7xl mx-auto px-6 py-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Blog</h1>
                        <p className="text-xl text-slate-400 max-w-2xl">
                            Artículos sobre desarrollo, tecnología y mejores prácticas
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

                    {posts.data.length === 0 ? (
                        <div className="text-center py-16">
                            <p className="text-slate-400 text-lg">No hay artículos publicados aún.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.data.map((post) => (
                                <a
                                    key={post.id}
                                    href={`/blog/${post.slug}`}
                                    className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden hover:border-cyan-500/50 transition-all group"
                                >
                                    {post.image && (
                                        <div className="aspect-video overflow-hidden">
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        {post.category && (
                                            <span className="text-xs font-medium text-cyan-400 uppercase tracking-wider">
                                                {post.category}
                                            </span>
                                        )}
                                        <h2 className="text-xl font-bold text-white mt-2 mb-2 group-hover:text-cyan-400 transition-colors">
                                            {post.title}
                                        </h2>
                                        {post.excerpt && (
                                            <p className="text-slate-400 text-sm line-clamp-2">
                                                {post.excerpt}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-800">
                                            <span className="text-slate-500 text-sm">
                                                {post.user?.name}
                                            </span>
                                            <span className="text-slate-500 text-sm">
                                                {new Date(post.published_at).toLocaleDateString('es-ES', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </a>
                            ))}
                        </div>
                    )}

                    {posts.last_page > 1 && (
                        <div className="flex justify-center gap-2 mt-12">
                            {posts.links.map((link, idx) => (
                                <a
                                    key={idx}
                                    href={link.url || '#'}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                        link.active
                                            ? 'bg-cyan-600 text-white'
                                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
