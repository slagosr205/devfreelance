import { Head } from '@inertiajs/react';

export default function About() {
    return (
        <>
            <Head title="Acerca de Mí | Desarrollador Freelance" />
            
            <div className="min-h-screen bg-slate-950">
                <div className="relative bg-gradient-to-b from-slate-900 to-slate-950 border-b border-slate-800">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyMDI5MzkiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50"></div>
                    <div className="relative max-w-7xl mx-auto px-6 py-16">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Acerca de Mí</h1>
                        <p className="text-xl text-slate-400 max-w-2xl">
                            Desarrollador freelance especializado en soluciones empresariales
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-6 py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                        <div>
                            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8">
                                <h2 className="text-2xl font-bold text-white mb-6">Mi Trayectoria</h2>
                                <div className="space-y-4 text-slate-300">
                                    <p>
                                        Soy un desarrollador freelance con más de 5 años de experiencia en el desarrollo 
                                        de soluciones empresariales. Me especializo en la integración de sistemas ERP 
                                        como SAP Business One y Odoo, así como en el desarrollo de aplicaciones web 
                                        personalizadas.
                                    </p>
                                    <p>
                                        Mi enfoque se centra en entender las necesidades específicas de cada cliente 
                                        para ofrecer soluciones que realmente agreguen valor a sus negocios. Creo 
                                        firmemente que la tecnología debe ser una herramienta que facilite el 
                                        crecimiento empresarial.
                                    </p>
                                    <p>
                                        Trabajo de forma remota con clientes de diferentes industrias, desde pequeñas 
                                        empresas hasta corporaciones grandes, siempre buscando la excelencia técnica 
                                        y la satisfacción del cliente.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 mt-6">
                                <h2 className="text-2xl font-bold text-white mb-6">Mis Habilidades</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        'Laravel', 'React', 'SAP Business One', 'Odoo ERP',
                                        'Python', 'PostgreSQL', 'MySQL', 'API REST',
                                        'Integración de Sistemas', 'Desarrollo Full Stack'
                                    ].map((skill) => (
                                        <div key={skill} className="flex items-center gap-2">
                                            <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span className="text-slate-300">{skill}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8">
                                <h2 className="text-2xl font-bold text-white mb-6">¿Por qué trabajar conmigo?</h2>
                                <div className="space-y-6">
                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-cyan-600/20 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">Calidad Garantizada</h3>
                                            <p className="text-slate-400 text-sm mt-1">
                                                Código limpio, bien documentado y escalable.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-cyan-600/20 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">Entregas a Tiempo</h3>
                                            <p className="text-slate-400 text-sm mt-1">
                                                Respeto los plazos acordados siempre.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-cyan-600/20 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">Comunicación Clara</h3>
                                            <p className="text-slate-400 text-sm mt-1">
                                                Siempre disponible para resolver tus dudas.
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <div className="w-12 h-12 rounded-xl bg-cyan-600/20 flex items-center justify-center flex-shrink-0">
                                            <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h3 className="text-white font-semibold">Soporte Post-Proyecto</h3>
                                            <p className="text-slate-400 text-sm mt-1">
                                                Incluye mantenimiento y actualizaciones.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl p-8">
                                <h2 className="text-2xl font-bold text-white mb-4">¿Interesado en trabajar juntos?</h2>
                                <p className="text-white/80 mb-6">
                                    Contáctame para discutir tu proyecto y ver cómo puedo ayudarte a alcanzar tus objetivos.
                                </p>
                                <a
                                    href="/contact"
                                    className="inline-flex items-center px-6 py-3 bg-white text-cyan-600 rounded-lg font-medium hover:bg-white/90 transition-colors"
                                >
                                    Contactar
                                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
