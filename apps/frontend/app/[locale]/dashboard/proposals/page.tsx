import { getTranslations } from 'next-intl/server';
import MyProposalsView from './MyProposalsView';

interface MyProposalsPageProps {
  params: {
    locale: string;
  };
}

export default async function MyProposalsPage({ params }: MyProposalsPageProps) {
  const { locale } = params;
  const t = await getTranslations('proposals');

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-[#2C2C2C]" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('myProposals')}</h1>
            <p className="text-[#5A5A5A]">{t('myProposalsDescription')}</p>
          </div>
          <MyProposalsView locale={locale} />
        </div>
      </div>
    </div>
  );
}
