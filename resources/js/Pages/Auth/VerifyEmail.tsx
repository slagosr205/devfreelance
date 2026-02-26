import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function VerifyEmail({ status }: { status?: string }) {
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Verificar Email" />

            <div className="mb-6 text-sm text-slate-400">
                ¡Gracias por registrarte! Antes de comenzar, verifica tu dirección de correo electrónico haciendo clic en el enlace que te enviamos. Si no recibiste el correo, con gusto te enviaremos otro.
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-emerald-400">
                    Se ha enviado un nuevo enlace de verificación a tu correo electrónico.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-6 flex flex-col gap-4">
                    <PrimaryButton 
                        className="w-full bg-gradient-to-r from-cyan-500 to-violet-600 hover:from-cyan-600 hover:to-violet-700 text-white py-3 rounded-xl font-medium" 
                        disabled={processing}
                    >
                        Reenviar Email de Verificación
                    </PrimaryButton>

                    <Link
                        href={route('logout')}
                        method="post"
                        as="button"
                        className="text-center text-sm text-slate-400 hover:text-cyan-400"
                    >
                        Cerrar Sesión
                    </Link>
                </div>
            </form>
        </GuestLayout>
    );
}
