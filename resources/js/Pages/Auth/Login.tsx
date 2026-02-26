import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Iniciar Sesión" />

            {status && (
                <div className="mb-4 text-sm font-medium text-emerald-400">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                <div>
                    <InputLabel htmlFor="email" value="Correo electrónico" className="text-slate-300" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2 text-red-400" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Contraseña" className="text-slate-300" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500"
                        autoComplete="current-password"
                        onChange={(e) => setData('password', e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2 text-red-400" />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData(
                                    'remember',
                                    (e.target.checked || false) as false,
                                )
                            }
                            className="rounded border-slate-600 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                        />
                        <span className="ms-2 text-sm text-slate-400">
                            Recordarme
                        </span>
                    </label>
                </div>

                <div className="mt-6 flex items-center justify-between">
                    {canResetPassword && (
                        <Link
                            href={route('password.request')}
                            className="text-sm text-slate-400 hover:text-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                        >
                            ¿Olvidaste tu contraseña?
                        </Link>
                    )}

                    <PrimaryButton 
                        className="bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-white px-6 py-2.5 rounded-xl font-medium" 
                        disabled={processing}
                    >
                        Iniciar Sesión
                    </PrimaryButton>
                </div>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <p className="text-slate-400 text-sm">
                    ¿No tienes una cuenta?{' '}
                    <Link
                        href={route('register')}
                        className="text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                        Regístrate aquí
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
