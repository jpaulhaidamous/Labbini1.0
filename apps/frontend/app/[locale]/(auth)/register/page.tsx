import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import RegisterForm from '@/components/auth/RegisterForm';

export default function RegisterPage({ params }: { params: { locale: string } }) {
  const t = useTranslations('auth');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FDF8F3] to-[#FFF4E0] px-4 py-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-[#2C2C2C]" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('joinLabbini')}</CardTitle>
          <CardDescription className="text-[#5A5A5A]">{t('startHiringWorking')}</CardDescription>
        </CardHeader>
        <CardContent>
          <RegisterForm locale={params.locale} />
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              {t('alreadyHaveAccount')}{' '}
              <Link href={`/${params.locale}/login`} className="text-[#1B5E4A] hover:underline font-medium">
                {t('signIn')}
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
