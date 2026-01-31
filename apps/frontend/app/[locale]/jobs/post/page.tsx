import { getTranslations } from 'next-intl/server';
import JobPostForm from '@/components/jobs/JobPostForm';

interface PostJobPageProps {
  params: {
    locale: string;
  };
}

export default async function PostJobPage({ params }: PostJobPageProps) {
  const { locale } = params;
  const t = await getTranslations('jobs');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">{t('postNewJob')}</h1>
        <p className="text-gray-600 mb-8">{t('postJobDescription')}</p>
        <JobPostForm locale={locale} />
      </div>
    </div>
  );
}
