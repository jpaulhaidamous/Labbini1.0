import { getTranslations } from 'next-intl/server';
import DashboardView from './DashboardView';

interface DashboardPageProps {
  params: {
    locale: string;
  };
}

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = params;
  const t = await getTranslations('dashboard');

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-[#2C2C2C]" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('dashboard')}</h1>
        </div>
        <DashboardView locale={locale} />
      </div>
    </div>
    </div>
  );
}
