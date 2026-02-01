import { getTranslations } from 'next-intl/server';
import ContractDetailView from './ContractDetailView';

interface ContractDetailPageProps {
  params: {
    locale: string;
    id: string;
  };
}

export default async function ContractDetailPage({ params }: ContractDetailPageProps) {
  const { locale, id } = params;
  const t = await getTranslations('contracts');

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <ContractDetailView locale={locale} contractId={id} />
        </div>
      </div>
    </div>
  );
}
