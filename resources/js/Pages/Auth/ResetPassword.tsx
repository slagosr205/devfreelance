import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ResetPassword({
    token,
    email,
}: {
    token: string;
    email: string;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Nueva Contraseña" />

            <form onSubmit={submit} className="space-y-5">
                <div>
                    <InputLabel htmlFor="email" value="Correo electrónico" className="text-slate-300" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        className="mt-1 block w-full bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500"
                        autoComplete="username"
                        onChange={(e) => setData('email', e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2 text-red-400" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Nueva contraseña" className="text-slate-300" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500"
                        autoComplete="new-password"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
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
                        type="password"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        className="mt-1 block w-full bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500"
                        autoComplete="new-password"
                        onChange={(e) =>
                            setData('password_confirmation', e.target.value)
                        }
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
                        Guardar Nueva Contraseña
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
