import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage({ params }: { params: { locale: string } }) {
  const t = useTranslations('auth');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Create Your Account</CardTitle>
          <CardDescription>Join Labbini and start working</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm locale={params.locale} />
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              {t('alreadyHaveAccount')}{' '}
              <Link href={`/${params.locale}/login`} className="text-primary hover:underline font-medium">
                {t('signIn')}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
