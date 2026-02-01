import JobEditView from './JobEditView';

interface JobEditPageProps {
  params: {
    locale: string;
    id: string;
  };
}

export default async function JobEditPage({ params }: JobEditPageProps) {
  const { locale, id } = params;

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <div className="container mx-auto px-4 py-8">
        <JobEditView locale={locale} jobId={id} />
      </div>
    </div>
  );
}
