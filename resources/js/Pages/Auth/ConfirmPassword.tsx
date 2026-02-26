import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirmar Contraseña" />

            <div className="mb-6 text-sm text-slate-400">
                Esta es un área segura de la aplicación. Por favor, confirma tu contraseña antes de continuar.
            </div>

            <form onSubmit={submit} className="space-y-5">
                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Contraseña" className="text-slate-300" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        value={data.password}
                        className="mt-1 block w-full bg-slate-800/50 border-slate-700 text-white placeholder-slate-500 focus:border-cyan-500 focus:ring-cyan-500"
                        isFocused={true}
                        onChange={(e) => setData('password', e.target.value)}
                        placeholder="Tu contraseña"
                    />

                    <InputError message={errors.password} className="mt-2 text-red-400" />
                </div>

                <div className="mt-6">
                    <PrimaryButton 
                        className="w-full bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-white py-3 rounded-xl font-medium" 
                        disabled={processing}
                    >
                        Confirmar
                    </PrimaryButton>
                </div>
            </form>
        </GuestLayout>
    );
}
