import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LoginForm from '@/components/auth/LoginForm';

export default function LoginPage({ params }: { params: { locale: string } }) {
  const t = useTranslations('auth');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FDF8F3] to-[#FFF4E0] px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-[#2C2C2C]" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('welcomeBack')}</CardTitle>
          <CardDescription className="text-[#5A5A5A]">{t('signInAccount')}</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm locale={params.locale} />
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              {t('dontHaveAccount')}{' '}
              <Link href={`/${params.locale}/register`} className="text-[#1B5E4A] hover:underline font-medium">
                {t('signUp')}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
