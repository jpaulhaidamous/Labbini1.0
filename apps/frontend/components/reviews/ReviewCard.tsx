'use client';

import { useTranslations } from 'next-intl';
import { Review } from '@/lib/api/reviews';
import { Card, CardContent } from '@/components/ui/card';
import RatingStars from './RatingStars';

interface ReviewCardProps {
  review: Review;
  locale: string;
}

export default function ReviewCard({ review, locale }: ReviewCardProps) {
  const t = useTranslations('reviews');

  const reviewerName =
    (locale === 'ar' && review.reviewer?.profile?.displayNameAr) ||
    review.reviewer?.profile?.displayNameEn ||
    review.reviewer?.email?.split('@')[0] ||
    'Unknown';

  const jobTitle =
    (locale === 'ar' && review.contract?.job?.titleAr) ||
    review.contract?.job?.titleEn ||
    '';

  return (
    <Card>
      <CardContent className="pt-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shrink-0">
              {review.reviewer?.profile?.avatarUrl ? (
                <img
                  src={review.reviewer.profile.avatarUrl}
                  alt={reviewerName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-sm text-gray-400">
                  {reviewerName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <p className="font-semibold">{reviewerName}</p>
              {jobTitle && <p className="text-xs text-gray-500">{jobTitle}</p>}
            </div>
          </div>
          <span className="text-xs text-gray-500">
            {new Date(review.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div className="mt-3">
          <div className="flex items-center gap-2">
            <RatingStars rating={review.overallRating} readOnly size="md" />
            <span className="text-sm font-semibold text-gray-700">{review.overallRating}/5</span>
          </div>
        </div>

        {review.publicReview && (
          <p className="mt-3 text-sm text-gray-700 whitespace-pre-wrap">{review.publicReview}</p>
        )}

        {/* Sub-ratings */}
        {(review.qualityRating || review.communicationRating || review.timelinessRating || review.professionalismRating) && (
          <div className="mt-3 pt-3 border-t grid grid-cols-2 gap-2">
            {review.qualityRating && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">{t('quality')}</span>
                <span className="font-medium">{review.qualityRating}/5</span>
              </div>
            )}
            {review.communicationRating && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">{t('communication')}</span>
                <span className="font-medium">{review.communicationRating}/5</span>
              </div>
            )}
            {review.timelinessRating && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">{t('timeliness')}</span>
                <span className="font-medium">{review.timelinessRating}/5</span>
              </div>
            )}
            {review.professionalismRating && (
              <div className="flex justify-between text-xs">
                <span className="text-gray-600">{t('professionalism')}</span>
                <span className="font-medium">{review.professionalismRating}/5</span>
              </div>
            )}
          </div>
        )}

        {review.wouldRecommend && (
          <p className="mt-2 text-xs text-green-600 font-medium">{t('wouldRecommend')}</p>
        )}
      </CardContent>
    </Card>
  );
}
