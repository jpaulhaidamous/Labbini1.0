import { getTranslations } from 'next-intl/server';
import MyJobsView from './MyJobsView';

interface MyJobsPageProps {
  params: {
    locale: string;
  };
}

export default async function MyJobsPage({ params }: MyJobsPageProps) {
  const { locale } = params;
  const t = await getTranslations('jobs');

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-[#2C2C2C]" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('myJobs')}</h1>
            <p className="text-[#5A5A5A]">{t('myJobsDescription')}</p>
          </div>
          <MyJobsView locale={locale} />
        </div>
      </div>
    </div>
  );
}
