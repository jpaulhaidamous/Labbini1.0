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
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{t('myJobs')}</h1>
          <p className="text-gray-600">{t('myJobsDescription')}</p>
        </div>
        <MyJobsView locale={locale} />
      </div>
    </div>
  );
}
