import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
                <div className="absolute top-1/2 -left-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-6 py-12">
                <div className="mb-8">
                    <Link href="/" className="flex items-center gap-3">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-[#0f172a] flex items-center justify-center">
                                <svg viewBox="0 0 110 110" className="w-10 h-10">
                                    <rect x="0" y="0" width="110" height="110" rx="18" fill="#0f172a"/>
                                    <circle cx="30" cy="30" r="6" fill="#00aaff"/>
                                    <circle cx="80" cy="30" r="6" fill="#00aaff"/>
                                    <circle cx="30" cy="80" r="6" fill="#00aaff"/>
                                    <circle cx="80" cy="80" r="6" fill="#00aaff"/>
                                    <line x1="30" y1="30" x2="80" y2="30" stroke="#00aaff" strokeWidth="2"/>
                                    <line x1="30" y1="30" x2="30" y2="80" stroke="#00aaff" strokeWidth="2"/>
                                    <line x1="80" y1="30" x2="80" y2="80" stroke="#00aaff" strokeWidth="2"/>
                                    <line x1="30" y1="80" x2="80" y2="80" stroke="#00aaff" strokeWidth="2"/>
                                </svg>
                            </div>
                            <div>
                                <span className="text-white font-semibold text-2xl block">Lineth<span className="text-cyan-400">Hn</span></span>
                                <span className="text-slate-500 text-xs tracking-wider">Links&Tech by Honduras</span>
                            </div>
                        </div>
                    </Link>
                </div>

                <div className="w-full max-w-md">
                    <div className="bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-2xl px-8 py-8 shadow-2xl">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
