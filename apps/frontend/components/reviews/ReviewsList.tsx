'use client';

import { useTranslations } from 'next-intl';
import { Review } from '@/lib/api/reviews';
import ReviewCard from './ReviewCard';
import RatingStars from './RatingStars';

interface ReviewsListProps {
  reviews: Review[];
  locale: string;
}

export default function ReviewsList({ reviews, locale }: ReviewsListProps) {
  const t = useTranslations('reviews');

  if (reviews.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        {t('noReviews')}
      </div>
    );
  }

  // Calculate average rating
  const avgRating = reviews.reduce((sum, r) => sum + r.overallRating, 0) / reviews.length;

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <p className="text-3xl font-bold">{avgRating.toFixed(1)}</p>
          <RatingStars rating={Math.round(avgRating)} readOnly size="sm" />
          <p className="text-xs text-gray-500 mt-1">
            {reviews.length} {t('reviewsCount')}
          </p>
        </div>
        <div className="flex-1">
          {[5, 4, 3, 2, 1].map((level) => {
            const count = reviews.filter((r) => r.overallRating === level).length;
            const pct = (count / reviews.length) * 100;
            return (
              <div key={level} className="flex items-center gap-2 text-xs">
                <span className="w-4 text-gray-600">{level}</span>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="w-6 text-gray-500">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review Cards */}
      <div className="space-y-3">
        {reviews.map((review) => (
          <ReviewCard key={review.id} review={review} locale={locale} />
        ))}
      </div>
    </div>
  );
}
