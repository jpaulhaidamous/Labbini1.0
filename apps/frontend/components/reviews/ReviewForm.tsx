'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useReviewsStore } from '@/lib/stores/reviews.store';
import { Button } from '@/components/ui/button';
import RatingStars from './RatingStars';

interface ReviewFormProps {
  contractId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ contractId, onSuccess }: ReviewFormProps) {
  const t = useTranslations('reviews');
  const { createReview } = useReviewsStore();

  const [overallRating, setOverallRating] = useState(0);
  const [qualityRating, setQualityRating] = useState(0);
  const [communicationRating, setCommunicationRating] = useState(0);
  const [timelinessRating, setTimelinessRating] = useState(0);
  const [professionalismRating, setProfessionalismRating] = useState(0);
  const [wouldRecommend, setWouldRecommend] = useState(false);
  const [publicReview, setPublicReview] = useState('');
  const [privateFeedback, setPrivateFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (overallRating === 0) {
      setError(t('ratingRequired'));
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await createReview({
        contractId,
        overallRating,
        qualityRating: qualityRating || undefined,
        communicationRating: communicationRating || undefined,
        timelinessRating: timelinessRating || undefined,
        professionalismRating: professionalismRating || undefined,
        wouldRecommend,
        publicReview: publicReview.trim() || undefined,
        privateFeedback: privateFeedback.trim() || undefined,
      });
      setSubmitted(true);
      onSuccess?.();
    } catch (err: any) {
      setError(err.response?.data?.message || t('submitError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8">
        <p className="text-green-600 font-semibold text-lg">{t('reviewSubmitted')}</p>
        <p className="text-gray-500 text-sm mt-1">{t('reviewSubmittedDesc')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Overall Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('overallRating')} <span className="text-red-500">*</span>
        </label>
        <RatingStars rating={overallRating} onRate={setOverallRating} size="lg" />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>

      {/* Sub-ratings */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('quality')}</label>
          <RatingStars rating={qualityRating} onRate={setQualityRating} size="sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('communication')}</label>
          <RatingStars rating={communicationRating} onRate={setCommunicationRating} size="sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('timeliness')}</label>
          <RatingStars rating={timelinessRating} onRate={setTimelinessRating} size="sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">{t('professionalism')}</label>
          <RatingStars rating={professionalismRating} onRate={setProfessionalismRating} size="sm" />
        </div>
      </div>

      {/* Would Recommend */}
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="wouldRecommend"
          checked={wouldRecommend}
          onChange={(e) => setWouldRecommend(e.target.checked)}
          className="w-4 h-4 rounded border-gray-300"
        />
        <label htmlFor="wouldRecommend" className="text-sm text-gray-700">
          {t('wouldRecommendLabel')}
        </label>
      </div>

      {/* Public Review */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('publicReview')}</label>
        <textarea
          value={publicReview}
          onChange={(e) => setPublicReview(e.target.value)}
          placeholder={t('publicReviewPlaceholder')}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Private Feedback */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{t('privateFeedback')}</label>
        <textarea
          value={privateFeedback}
          onChange={(e) => setPrivateFeedback(e.target.value)}
          placeholder={t('privateFeedbackPlaceholder')}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <p className="text-xs text-gray-500 mt-1">{t('privateFeedbackNote')}</p>
      </div>

      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? t('submitting') : t('submitReview')}
      </Button>
    </form>
  );
}
