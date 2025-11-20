// Components
import EmailVerificationNotificationController from '@/actions/App/Http/Controllers/Auth/EmailVerificationNotificationController';
import { logout } from '@/routes';
import { Form, Head } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';

import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import AuthLayout from '@/layouts/auth-layout';

export default function VerifyEmail({ status }: { status?: string }) {
    return (
        <AuthLayout
            title="Vérifier l'e-mail"
            description="Veuillez vérifier votre adresse e-mail en cliquant sur le lien que nous venons de vous envoyer."
        >
            <Head title="Vérification de l'e-mail" />

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-center text-sm font-medium text-green-600">
                    Un nouveau lien de vérification a été envoyé à l'adresse e-mail
                    que vous avez fournie lors de l'inscription.
                </div>
            )}

            <Form
                {...EmailVerificationNotificationController.store.form()}
                className="space-y-6 text-center"
            >
                {({ processing }) => (
                    <>
                        <Button disabled={processing} variant="secondary">
                            {processing && (
                                <LoaderCircle className="h-4 w-4 animate-spin" />
                            )}
                            Renvoyer l'e-mail de vérification
                        </Button>

                        <TextLink
                            href={logout()}
                            className="mx-auto block text-sm"
                        >
                            Se déconnecter
                        </TextLink>
                    </>
                )}
            </Form>
        </AuthLayout>
    );
}
