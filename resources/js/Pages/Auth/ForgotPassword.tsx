import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Recuperar Contraseña" />

            <div className="mb-6 text-sm text-slate-400">
                ¿Olvidaste tu contraseña? No hay problema. Ingresa tu correo electrónico y te enviaremos un enlace para recuperar tu contraseña.
            </div>

            {status && (
                <div className="mb-4 text-sm font-medium text-emerald-400">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500"
                        isFocused={true}
                        onChange={(e) => setData('email', e.target.value)}
                        placeholder="tu@email.com"
                    />

                    <InputError message={errors.email} className="mt-2 text-red-400" />
                </div>

                <div className="mt-6">
                    <PrimaryButton 
                        className="w-full bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-white py-3 rounded-xl font-medium" 
                        disabled={processing}
                    >
                        Enviar Enlace de Recuperación
                    </PrimaryButton>
                </div>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <p className="text-slate-400 text-sm">
                    ¿Recordaste tu contraseña?{' '}
                    <Link
                        href={route('login')}
                        className="text-cyan-400 hover:text-cyan-300 font-medium"
                    >
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
