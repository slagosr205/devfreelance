import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Crear Cuenta" />

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="name" value="Nombre completo" className="text-slate-300" />

                    <TextInput
                        id="name"
                        name="name"
                        value={data.name}
                        className="mt-1 block w-full bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500"
                        autoComplete="name"
                        isFocused={true}
                        onChange={(e) => setData('name', e.target.value)}
                        required
                        placeholder="Tu nombre"
                    />

                    <InputError message={errors.name} className="mt-2 text-red-400" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="email" value="Correo electrónico" className="text-slate-300" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                        required
                        placeholder="tu@email.com"
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
                        autoComplete="new-password"
                        onChange={(e) => setData('password', e.target.value)}
                        required
                        placeholder="Mínimo 8 caracteres"
                    />

                    <InputError message={errors.password} className="mt-2 text-red-400" />
                </div>

                <div className="mt-4">
                    <InputLabel
                        htmlFor="password_confirmation"
                        value="Confirmar contraseña"
                        className="text-slate-300"
                    />

                    <TextInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
                        required
                        placeholder="Repite tu contraseña"
                    />

                    <InputError
                        message={errors.password_confirmation}
                        className="mt-2 text-red-400"
                    />
                </div>

                <div className="mt-6">
                    <PrimaryButton 
                        className="w-full bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-white py-3 rounded-xl font-medium" 
                        disabled={processing}
                    >
                        Crear Cuenta
                    </PrimaryButton>
                </div>
            </form>

            <div className="mt-6 pt-6 border-t border-white/10 text-center">
                <p className="text-slate-400 text-sm">
                    ¿Ya tienes una cuenta?{' '}
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
