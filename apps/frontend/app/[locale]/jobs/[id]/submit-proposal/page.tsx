import { getTranslations } from 'next-intl/server';
import SubmitProposalView from './SubmitProposalView';

interface SubmitProposalPageProps {
  params: {
    locale: string;
    id: string;
  };
}

export default async function SubmitProposalPage({ params }: SubmitProposalPageProps) {
  const { locale, id } = params;
  const t = await getTranslations('proposals');

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-2 text-[#2C2C2C]" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('submitProposal')}</h1>
          <SubmitProposalView locale={locale} jobId={id} />
        </div>
      </div>
    </div>
  );
}
