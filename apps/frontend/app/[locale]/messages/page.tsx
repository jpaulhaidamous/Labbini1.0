import { getTranslations } from 'next-intl/server';
import MessagesView from './MessagesView';

interface MessagesPageProps {
  params: {
    locale: string;
  };
}

export default async function MessagesPage({ params }: MessagesPageProps) {
  const { locale } = params;
  const t = await getTranslations('messages');

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#2C2C2C]" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('messages')}</h1>
          </div>
          <MessagesView locale={locale} />
        </div>
      </div>
    </div>
  );
}
