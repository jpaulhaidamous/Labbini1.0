import { getTranslations } from 'next-intl/server';
import ReviewView from './ReviewView';

interface ReviewPageProps {
  params: {
    locale: string;
    id: string;
  };
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { locale, id } = params;
  const t = await getTranslations('reviews');

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#2C2C2C]" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('leaveReview')}</h1>
            <p className="text-[#5A5A5A] mt-1">{t('leaveReviewDesc')}</p>
          </div>
          <ReviewView locale={locale} contractId={id} />
        </div>
      </div>
    </div>
  );
}
