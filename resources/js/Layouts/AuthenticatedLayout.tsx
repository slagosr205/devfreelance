import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { PropsWithChildren, ReactNode, useState } from 'react';

export default function Authenticated({
    header,
    children,
}: PropsWithChildren<{ header?: ReactNode }>) {
    const pageProps = usePage().props as { auth?: { user?: { name: string; email: string } }, isAdmin?: boolean };
    const user = pageProps.auth?.user;
    const isAdmin = pageProps.isAdmin;

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [showCrmDropdown, setShowCrmDropdown] = useState(false);
    const [showAdminDropdown, setShowAdminDropdown] = useState(false);

    const crmItems = [
        { name: 'Clientes', href: '/admin/clients', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { name: 'Contactos', href: '/admin/contacts', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
        { name: 'Cotizaciones', href: '/quotes', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
        { name: 'Facturas', href: '/invoices', icon: 'M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z' },
    ];

    const adminItems = [
        { name: 'Panel Admin', href: '/admin/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
        { name: 'Usuarios', href: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { name: 'Estadisticas', href: '/admin/visits', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    ];

    const isActive = (href: string) => window.location.pathname.startsWith(href);

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Sidebar */}
            <div className="fixed inset-y-0 left-0 w-64 bg-slate-900 border-r border-slate-800 z-40">
                <div className="flex items-center h-16 px-6 border-b border-slate-800">
                    <Link href="/" className="flex items-center gap-3">
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
                        <div>
                            <span className="text-white font-semibold text-sm">Lineth<span className="text-cyan-400">Hn</span></span>
                        </div>
                    </Link>
                </div>

                <nav className="px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-4rem)]">
                    {/* Dashboard */}
                    <Link
                        href="/dashboard"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            isActive('/dashboard') && !isActive('/admin')
                                ? 'bg-cyan-600/20 text-cyan-400'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Dashboard
                    </Link>

                    {/* CRM Dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowCrmDropdown(!showCrmDropdown)}
                            className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                isActive('/admin/clients') || isActive('/quotes') || isActive('/invoices')
                                    ? 'bg-cyan-600/20 text-cyan-400'
                                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                CRM
                            </div>
                            <svg className={`w-4 h-4 transition-transform ${showCrmDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        
                        {showCrmDropdown && (
                            <div className="mt-1 ml-4 space-y-1">
                                {crmItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                            isActive(item.href)
                                                ? 'bg-cyan-600/20 text-cyan-400'
                                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                        }`}
                                    >
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                                        </svg>
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Projects */}
                    <Link
                        href="/projects-board"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            isActive('/projects-board')
                                ? 'bg-cyan-600/20 text-cyan-400'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7" />
                        </svg>
                        Proyectos
                    </Link>

                    {/* Payments */}
                    <Link
                        href="/admin/payments"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            isActive('/admin/payments')
                                ? 'bg-cyan-600/20 text-cyan-400'
                                : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                    >
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        Pagos
                    </Link>

                    {/* Admin Section */}
                    {isAdmin && (
                        <div className="pt-4 mt-4 border-t border-slate-800">
                            <div className="px-3 mb-2">
                                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Admin</span>
                            </div>
                            
                            <div className="relative">
                                <button
                                    onClick={() => setShowAdminDropdown(!showAdminDropdown)}
                                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                        isActive('/admin/') && !isActive('/admin/payments') && !isActive('/admin/clients')
                                            ? 'bg-cyan-600/20 text-cyan-400'
                                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Configuracion
                                    </div>
                                    <svg className={`w-4 h-4 transition-transform ${showAdminDropdown ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </button>
                                
                                {showAdminDropdown && (
                                    <div className="mt-1 ml-4 space-y-1">
                                        {adminItems.map((item) => (
                                            <Link
                                                key={item.name}
                                                href={item.href}
                                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                                                    isActive(item.href)
                                                        ? 'bg-cyan-600/20 text-cyan-400'
                                                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                                                }`}
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                                                </svg>
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </nav>
            </div>

            {/* Main Content */}
            <div className="pl-64">
                {/* Top Header */}
                <header className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                            className="lg:hidden p-2 text-slate-400 hover:text-white"
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button className="flex items-center gap-3 text-sm font-medium text-slate-300 hover:text-white">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-white font-medium">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        {user?.name}
                                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href="/profile">
                                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        Perfil
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        Cerrar Sesion
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </header>

                <main className="p-6">{children}</main>
            </div>

            {/* Mobile Navigation */}
            {showingNavigationDropdown && (
                <div className="fixed inset-0 z-50 lg:hidden">
                    <div className="fixed inset-0 bg-black/50" onClick={() => setShowingNavigationDropdown(false)} />
                    <div className="fixed inset-y-0 left-0 w-64 bg-slate-900 p-4">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-white font-semibold">Menu</span>
                            <button onClick={() => setShowingNavigationDropdown(false)} className="text-slate-400">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <nav className="space-y-2">
                            <ResponsiveNavLink href="/dashboard">Dashboard</ResponsiveNavLink>
                            <ResponsiveNavLink href="/admin/clients">Clientes</ResponsiveNavLink>
                            <ResponsiveNavLink href="/admin/contacts">Contactos</ResponsiveNavLink>
                            <ResponsiveNavLink href="/quotes">Cotizaciones</ResponsiveNavLink>
                            <ResponsiveNavLink href="/invoices">Facturas</ResponsiveNavLink>
                            <ResponsiveNavLink href="/projects-board">Proyectos</ResponsiveNavLink>
                            <ResponsiveNavLink href="/admin/payments">Pagos</ResponsiveNavLink>
                            {isAdmin && (
                                <>
                                    <div className="pt-4 mt-4 border-t border-slate-700">
                                        <span className="text-xs text-slate-500">Admin</span>
                                    </div>
                                    <ResponsiveNavLink href="/admin/dashboard">Panel Admin</ResponsiveNavLink>
                                    <ResponsiveNavLink href="/admin/users">Usuarios</ResponsiveNavLink>
                                    <ResponsiveNavLink href="/admin/visits">Estadisticas</ResponsiveNavLink>
                                </>
                            )}
                        </nav>
                    </div>
                </div>
            )}
        </div>
    );
}
