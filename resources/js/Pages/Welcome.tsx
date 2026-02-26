import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import { useState, useEffect, useRef } from 'react';

declare const Swal: any;

interface Stats {
    totalVisits: number;
    todayVisits: number;
    countries: { country: string; count: number }[];
}

const FadeIn = ({ children, delay = 0, className = '', loop = false }: { children: React.ReactNode; delay?: number; className?: string; loop?: boolean }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), delay);
                    if (!loop) {
                        observer.disconnect();
                    }
                } else if (loop) {
                    setTimeout(() => setIsVisible(false), delay + 500);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [delay, loop]);

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            } ${className}`}
        >
            {children}
        </div>
    );
};

const FadeInUp = ({ children, delay = 0, loop = false }: { children: React.ReactNode; delay?: number; loop?: boolean }) => (
    <FadeIn delay={delay} loop={loop} className="translate-y-8">
        {children}
    </FadeIn>
);

const FadeInLeft = ({ children, delay = 0, loop = false }: { children: React.ReactNode; delay?: number; loop?: boolean }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), delay);
                    if (!loop) {
                        observer.disconnect();
                    }
                } else if (loop) {
                    setTimeout(() => setIsVisible(false), delay + 500);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [delay, loop]);

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
            }`}
        >
            {children}
        </div>
    );
};

const FadeInRight = ({ children, delay = 0, loop = false }: { children: React.ReactNode; delay?: number; loop?: boolean }) => {
    const [isVisible, setIsVisible] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setTimeout(() => setIsVisible(true), delay);
                    if (!loop) {
                        observer.disconnect();
                    }
                } else if (loop) {
                    setTimeout(() => setIsVisible(false), delay + 500);
                }
            },
            { threshold: 0.1 }
        );

        if (ref.current) {
            observer.observe(ref.current);
        }

        return () => observer.disconnect();
    }, [delay, loop]);

    return (
        <div
            ref={ref}
            className={`transition-all duration-1000 ease-out ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
            }`}
        >
            {children}
        </div>
    );
};

export default function Welcome({
    stats,
}: PageProps<{ stats: Stats }>) {
    const [isLoading, setIsLoading] = useState(false);
    const [contactForm, setContactForm] = useState({
        name: '',
        email: '',
        phone: '',
        company: '',
        service: '',
        message: '',
    });
    const [contactLoading, setContactLoading] = useState(false);
    const [contactSuccess, setContactSuccess] = useState(false);

    const handleContactSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setContactLoading(true);
        
        try {
            const response = await fetch('/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify(contactForm),
            });
            
            const data = await response.json();
            
            if (data.success) {
                setContactSuccess(true);
                setContactForm({ name: '', email: '', phone: '', company: '', service: '', message: '' });
                Swal.fire({
                    icon: 'success',
                    title: '¡Mensaje enviado!',
                    text: 'Te contactaremos pronto. Revisa tu correo para la confirmación.',
                    confirmButtonColor: '#06b6d4',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al enviar el mensaje. Por favor intenta de nuevo.',
                confirmButtonColor: '#06b6d4',
            });
        } finally {
            setContactLoading(false);
        }
    };

    const handlePayPalPayment = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/payment/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                },
                body: JSON.stringify({
                    amount: 100.00,
                    description: 'Servicio de desarrollo freelance',
                }),
            });
            const data = await response.json();
            if (data.success && data.approvalUrl) {
                window.location.href = data.approvalUrl;
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Error al procesar el pago. Por favor intenta de nuevo.',
                    confirmButtonColor: '#06b6d4',
                });
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Error al procesar el pago. Por favor intenta de nuevo.',
                confirmButtonColor: '#06b6d4',
            });
        } finally {
            setIsLoading(false);
        }
    };
    const services = [
        {
            title: 'SAP Business One',
            description: 'Integración completa de SAP B1 con sistemas externos, configuración de módulos y optimización de procesos empresariales.',
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
            ),
            features: ['Integración de datos', 'Configuración de módulos', 'Desarrollo de add-ons', 'Migración de datos'],
        },
        {
            title: 'Odoo ERP',
            description: 'Implementación, personalización y desarrollo de módulos específicos para las necesidades de tu empresa.',
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m0 0l4.5-4.5M12 12v0" />
                </svg>
            ),
            features: ['Implementación', 'Desarrollo de módulos', 'Integración API', 'Soporte técnico'],
        },
        {
            title: 'Desarrollo de Módulos',
            description: 'Creación de soluciones personalizadas que se adaptan perfectamente a los requisitos específicos de tu negocio.',
            icon: (
                <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
                </svg>
            ),
            features: ['Análisis de requisitos', 'Diseño modular', 'Desarrollo ágil', 'Documentación completa'],
        },
    ];

    const technologies = [
        { name: 'Laravel', icon: 'L' },
        { name: 'React', icon: 'R' },
        { name: 'SAP B1', icon: 'S' },
        { name: 'Odoo', icon: 'O' },
        { name: 'Python', icon: 'Py' },
        { name: 'PostgreSQL', icon: 'Pg' },
    ];

    return (
        <>
            <Head>
                <title>Desarrollador Freelance | SAP Business One, Odoo & Desarrollo Personalizado</title>
                <meta name="description" content="Desarrollador freelance especializado en integración de SAP Business One, sistemas Odoo ERP y desarrollo de módulos personalizados. Transformo tu negocio con tecnología de vanguardia." />
                <meta name="keywords" content="desarrollador freelance, SAP Business One, Odoo ERP, integración de sistemas, desarrollo de módulos, consultoría ERP, implementador SAP, experto Odoo" />
                <meta name="author" content="LinethHn" />
                <meta name="robots" content="index, follow" />
                <meta property="og:title" content="Desarrollador Freelance | SAP, Odoo & Desarrollo Personalizado" />
                <meta property="og:description" content="Especialista en integración de SAP Business One, Odoo ERP y desarrollo de soluciones personalizadas para empresas." />
                <meta property="og:type" content="website" />
                <meta property="og:locale" content="es_ES" />
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Desarrollador Freelance | SAP, Odoo & Desarrollo Personalizado" />
                <meta name="twitter:description" content="Especialista en integración de SAP Business One, Odoo ERP y desarrollo de soluciones personalizadas." />
                <link rel="canonical" href="https://devfreelance.com" />
            </Head>
            
            <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
                {/* Animated background */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute top-1/2 -left-40 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"></div>
                </div>

                {/* Navigation */}
                <nav className="relative z-10 border-b border-white/5 backdrop-blur-sm">
                    <FadeIn className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#0f172a] flex items-center justify-center p-1">
                                <svg viewBox="0 0 110 110" className="w-full h-full">
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
                            <span className="text-white font-semibold text-xl">Lineth<span className="text-cyan-400">Hn</span></span>
                        </div>
                        <div className="hidden md:flex items-center gap-8">
                            <a href="#servicios" className="text-slate-400 hover:text-white transition-colors">Servicios</a>
                            <a href="#tecnologias" className="text-slate-400 hover:text-white transition-colors">Tecnologías</a>
                            <a href="#contacto" className="text-slate-400 hover:text-white transition-colors">Contacto</a>
                            <a 
                                href="#contacto" 
                                className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
                            >
                                Contratar Ahora
                            </a>
                        </div>
                    </FadeIn>
                </nav>

                {/* Hero Section */}
                <section className="relative z-10 pt-20 pb-32 px-6">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            <div className="space-y-8">
                                <FadeIn delay={100} loop={true}>
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full border border-white/10">
                                        <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                        <span className="text-slate-300 text-sm">Disponible para proyectos</span>
                                    </div>
                                </FadeIn>
                                
                                <FadeIn delay={200}>
                                    <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                                        Transforma tu negocio con{' '}
                                        <span className="bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
                                            tecnología de vanguardia
                                        </span>
                                    </h1>
                                </FadeIn>
                                
                                <FadeIn delay={300}>
                                    <p className="text-xl text-slate-400 leading-relaxed max-w-xl">
                                        Soy desarrollador freelance especializado en integración de sistemas ERP, 
                                        SAP Business One, Odoo y desarrollo de soluciones personalizadas que impulsan el crecimiento de tu empresa.
                                    </p>
                                </FadeIn>
                                
                                <FadeIn delay={400}>
                                    <div className="flex flex-wrap gap-4">
                                        <a 
                                            href="#contacto" 
                                            className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all hover:scale-105 shadow-lg shadow-cyan-500/25"
                                        >
                                            Iniciar Proyecto
                                        </a>
                                        <a 
                                            href="#servicios" 
                                            className="px-8 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-semibold hover:bg-white/10 transition-all"
                                        >
                                            Ver Servicios
                                        </a>
                                    </div>
                                </FadeIn>

                                <FadeIn delay={500}>
                                    <div className="flex items-center gap-8 pt-4">
                                        <div>
                                            <div className="text-3xl font-bold text-white">5+</div>
                                            <div className="text-slate-500">Años de experiencia</div>
                                        </div>
                                        <div className="w-px h-12 bg-white/10"></div>
                                        <div>
                                            <div className="text-3xl font-bold text-white">50+</div>
                                            <div className="text-slate-500">Proyectos completados</div>
                                        </div>
                                        <div className="w-px h-12 bg-white/10"></div>
                                        <div>
                                            <div className="text-3xl font-bold text-white">100%</div>
                                            <div className="text-slate-500">Cliente satisfecho</div>
                                        </div>
                                    </div>
                                </FadeIn>
                            </div>

                            <FadeInRight delay={300}>
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 to-violet-600/20 rounded-3xl blur-3xl"></div>
                                    <div className="relative bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8">
                                        <div className="space-y-6">
                                            <FadeInUp delay={400}>
                                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                                                    <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                                                        <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-semibold">SAP Business One</div>
                                                        <div className="text-slate-500 text-sm">Integración y configuración</div>
                                                    </div>
                                                </div>
                                            </FadeInUp>
                                            
                                            <FadeInUp delay={500}>
                                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                                                    <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                                                        <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-semibold">Odoo ERP</div>
                                                        <div className="text-slate-500 text-sm">Implementación y módulos</div>
                                                    </div>
                                                </div>
                                            </FadeInUp>
                                            
                                            <FadeInUp delay={600}>
                                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                                                    <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                                        <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                                        </svg>
                                                    </div>
                                                    <div>
                                                        <div className="text-white font-semibold">Desarrollo Personalizado</div>
                                                        <div className="text-slate-500 text-sm">Soluciones a medida</div>
                                                    </div>
                                                </div>
                                            </FadeInUp>
                                        </div>
                                    </div>
                                </div>
                            </FadeInRight>
                        </div>
                    </div>
                </section>

                {/* Services Section */}
                <section id="servicios" className="relative z-10 py-24 px-6 bg-slate-950/50">
                    <div className="max-w-7xl mx-auto">
                        <FadeIn>
                            <div className="text-center mb-16">
                                <h2 className="text-4xl font-bold text-white mb-4">
                                    Servicios <span className="text-cyan-400">Profesionales</span>
                                </h2>
                                <p className="text-slate-400 text-lg max-w-2xl mx-auto">
                                    Soluciones integrales para la transformación digital de tu empresa
                                </p>
                            </div>
                        </FadeIn>

                        <div className="grid md:grid-cols-3 gap-8">
                            {services.map((service, index) => (
                                <FadeIn key={index} delay={index * 150} loop={true}>
                                    <div 
                                        className="group relative bg-slate-900/50 backdrop-blur-xl border border-white/5 rounded-2xl p-8 hover:border-cyan-500/30 transition-all hover:-translate-y-1"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-violet-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                        <div className="relative">
                                            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-cyan-500/20 to-violet-600/20 flex items-center justify-center text-cyan-400 mb-6">
                                                {service.icon}
                                            </div>
                                            
                                            <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                                            <p className="text-slate-400 mb-6">{service.description}</p>
                                            
                                            <ul className="space-y-3">
                                                {service.features.map((feature, fIndex) => (
                                                    <li key={fIndex} className="flex items-center gap-3 text-slate-300">
                                                        <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                        </svg>
                                                        {feature}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </FadeIn>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Technologies Section */}
                <section id="tecnologias" className="relative z-10 py-24 px-6">
                    <div className="max-w-7xl mx-auto">
                        <FadeIn>
                            <div className="text-center mb-16">
                                <h2 className="text-4xl font-bold text-white mb-4">
                                    Tecnologías que <span className="text-violet-400">Domino</span>
                                </h2>
                                <p className="text-slate-400 text-lg">
                                    Stack tecnológico moderno para soluciones robustas
                                </p>
                            </div>
                        </FadeIn>

                        <FadeIn delay={200} loop={true}>
                            <div className="flex flex-wrap justify-center gap-4">
                                {technologies.map((tech, index) => (
                                    <FadeIn key={index} delay={index * 100} loop={true}>
                                        <div 
                                            className="px-6 py-4 bg-slate-900/50 border border-white/10 rounded-xl hover:border-violet-500/50 hover:bg-slate-800/50 transition-all cursor-default"
                                        >
                                            <span className="text-white font-semibold">{tech.name}</span>
                                        </div>
                                    </FadeIn>
                                ))}
                            </div>
                        </FadeIn>
                    </div>
                </section>

                {/* Contact Section */}
                <section id="contacto" className="relative z-10 py-24 px-6 bg-slate-950/50">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid lg:grid-cols-2 gap-16">
                            <FadeInLeft>
                                <div>
                                    <h2 className="text-4xl font-bold text-white mb-6">
                                        ¿Listo para <span className="text-emerald-400">transformar</span> tu negocio?
                                    </h2>
                                    <p className="text-slate-400 text-lg mb-8">
                                        Contáctame hoy y discutamos cómo puedo ayudarte a alcanzar tus objetivos tecnológicos.
                                    </p>

                                    <div className="space-y-6">
                                        <FadeInUp delay={100}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-cyan-500/20 flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="text-slate-500 text-sm">Email</div>
                                                    <div className="text-white font-medium">contacto@devfreelance.com</div>
                                                </div>
                                            </div>
                                        </FadeInUp>
                                        
                                        <FadeInUp delay={200}>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-violet-500/20 flex items-center justify-center">
                                                    <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <div className="text-slate-500 text-sm">Ubicación</div>
                                                    <div className="text-white font-medium">Disponibilidad Remota</div>
                                                </div>
                                            </div>
                                        </FadeInUp>
                                    </div>
                                </div>
                            </FadeInLeft>

                            <FadeInRight delay={200}>
                                <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                                    {contactSuccess ? (
                                        <div className="text-center py-12">
                                            <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                                <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                </svg>
                                            </div>
                                            <h3 className="text-2xl font-bold text-white mb-3">¡Mensaje enviado!</h3>
                                            <p className="text-slate-400 mb-6">Gracias por contactarnos. Te responderemos en 24-48 horas.</p>
                                            <button
                                                onClick={() => setContactSuccess(false)}
                                                className="px-6 py-3 bg-cyan-500 text-white rounded-xl font-medium hover:bg-cyan-600 transition-colors"
                                            >
                                                Enviar otro mensaje
                                            </button>
                                        </div>
                                    ) : (
                                    <form onSubmit={handleContactSubmit} className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <FadeInUp delay={300}>
                                                <div>
                                                    <label className="block text-slate-400 text-sm mb-2">Nombre completo *</label>
                                                    <input 
                                                        type="text" 
                                                        value={contactForm.name}
                                                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                                                        required
                                                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                                        placeholder="Tu nombre"
                                                    />
                                                </div>
                                            </FadeInUp>
                                            <FadeInUp delay={400}>
                                                <div>
                                                    <label className="block text-slate-400 text-sm mb-2">Email *</label>
                                                    <input 
                                                        type="email" 
                                                        value={contactForm.email}
                                                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                                                        required
                                                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                                        placeholder="tu@email.com"
                                                    />
                                                </div>
                                            </FadeInUp>
                                        </div>
                                        
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <FadeInUp delay={350}>
                                                <div>
                                                    <label className="block text-slate-400 text-sm mb-2">Teléfono</label>
                                                    <input 
                                                        type="tel" 
                                                        value={contactForm.phone}
                                                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                                                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                                        placeholder="+504 1234-5678"
                                                    />
                                                </div>
                                            </FadeInUp>
                                            <FadeInUp delay={450}>
                                                <div>
                                                    <label className="block text-slate-400 text-sm mb-2">Empresa</label>
                                                    <input 
                                                        type="text" 
                                                        value={contactForm.company}
                                                        onChange={(e) => setContactForm({ ...contactForm, company: e.target.value })}
                                                        className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                                        placeholder="Nombre de tu empresa"
                                                    />
                                                </div>
                                            </FadeInUp>
                                        </div>
                                        
                                        <FadeInUp delay={500}>
                                            <div>
                                                <label className="block text-slate-400 text-sm mb-2">Servicio de interés</label>
                                                <select 
                                                    value={contactForm.service}
                                                    onChange={(e) => setContactForm({ ...contactForm, service: e.target.value })}
                                                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors"
                                                >
                                                    <option value="">Selecciona un servicio</option>
                                                    <option value="sap">SAP Business One</option>
                                                    <option value="odoo">Odoo ERP</option>
                                                    <option value="modules">Desarrollo de Módulos</option>
                                                    <option value="other">Otro</option>
                                                </select>
                                            </div>
                                        </FadeInUp>
                                        
                                        <FadeInUp delay={600}>
                                            <div>
                                                <label className="block text-slate-400 text-sm mb-2">Mensaje</label>
                                                <textarea 
                                                    rows={4}
                                                    value={contactForm.message}
                                                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                                                    required
                                                    className="w-full px-4 py-3 bg-slate-800/50 border border-white/10 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                                                    placeholder="Describe tu proyecto..."
                                                ></textarea>
                                            </div>
                                        </FadeInUp>

                                        <FadeInUp delay={700}>
                                            <button 
                                                type="submit" 
                                                disabled={contactLoading}
                                                className="w-full py-4 bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-xl font-semibold hover:opacity-90 transition-all hover:scale-[1.02] shadow-lg shadow-cyan-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                            >
                                                {contactLoading ? (
                                                    <>
                                                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Enviando...
                                                    </>
                                                ) : (
                                                    'Enviar Mensaje'
                                                )}
                                            </button>
                                        </FadeInUp>

                                        
                                    </form>
                                    )}
                                </div>
                            </FadeInRight>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="relative z-10 py-16 px-6 border-t border-white/5">
                    <div className="max-w-7xl mx-auto">
                        <div className="grid md:grid-cols-3 gap-8 text-center">
                            <FadeInUp delay={100} loop={true}>
                                <div>
                                    <div className="text-4xl font-bold text-white mb-2">{stats.totalVisits}</div>
                                    <div className="text-slate-500">Visitas totales</div>
                                </div>
                            </FadeInUp>
                            <FadeInUp delay={200} loop={true}>
                                <div>
                                    <div className="text-4xl font-bold text-white mb-2">{stats.todayVisits}</div>
                                    <div className="text-slate-500">Visitas hoy</div>
                                </div>
                            </FadeInUp>
                            <FadeInUp delay={300} loop={true}>
                                <div>
                                    <div className="text-4xl font-bold text-white mb-2">{stats.countries.length}</div>
                                    <div className="text-slate-500">Países</div>
                                </div>
                            </FadeInUp>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="relative z-10 py-12 px-6 border-t border-white/5">
                    <div className="max-w-7xl mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-[#0f172a] flex items-center justify-center p-1">
                                    <svg viewBox="0 0 110 110" className="w-full h-full">
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
                                <span className="text-white font-semibold">Lineth<span className="text-cyan-400">Hn</span></span>
                            </div>
                            <div className="text-slate-500 text-sm">
                                © 2026 LinethHn. Todos los derechos reservados.
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
