import { getTranslations } from 'next-intl/server';
import JobDetailView from './JobDetailView';

interface JobDetailPageProps {
  params: {
    locale: string;
    id: string;
  };
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { locale, id } = params;
  const t = await getTranslations('jobs');

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <div className="container mx-auto px-4 py-8">
        <JobDetailView locale={locale} jobId={id} />
      </div>
    </div>
  );
}
