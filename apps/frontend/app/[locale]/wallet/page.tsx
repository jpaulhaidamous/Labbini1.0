import { getTranslations } from 'next-intl/server';
import WalletView from './WalletView';

interface WalletPageProps {
  params: {
    locale: string;
  };
}

export default async function WalletPage({ params }: WalletPageProps) {
  const { locale } = params;
  const t = await getTranslations('wallet');

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-2 text-[#2C2C2C]" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('wallet')}</h1>
            <p className="text-[#5A5A5A]">{t('walletDescription')}</p>
          </div>
          <WalletView locale={locale} />
        </div>
      </div>
    </div>
  );
}
