import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage({ params }: { params: { locale: string } }) {
  const t = useTranslations('auth');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back to Labbini</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm locale={params.locale} />
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              {t('dontHaveAccount')}{' '}
              <Link href={`/${params.locale}/register`} className="text-primary hover:underline font-medium">
                {t('signUp')}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
