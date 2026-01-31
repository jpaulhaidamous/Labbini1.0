import { getTranslations } from 'next-intl/server';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import PhoneVerificationForm from '@/components/auth/PhoneVerificationForm';

export default async function VerifyPhonePage() {
  const t = await getTranslations('auth');

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">
            {t('verifyPhone')}
          </CardTitle>
          <CardDescription>
            {t('verifyPhoneDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <PhoneVerificationForm />
        </CardContent>
      </Card>
    </div>
  );
}
