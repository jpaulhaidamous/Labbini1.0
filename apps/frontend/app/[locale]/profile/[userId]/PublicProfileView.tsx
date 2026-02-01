'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useProfilesStore } from '@/lib/stores/profiles.store';
import { reviewsApi, Review } from '@/lib/api/reviews';
import ProfileCard from '@/components/profile/ProfileCard';
import ReviewsList from '@/components/reviews/ReviewsList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PublicProfileViewProps {
  locale: string;
  userId: string;
}

export default function PublicProfileView({ locale, userId }: PublicProfileViewProps) {
  const t = useTranslations('profile');
  const tReviews = useTranslations('reviews');
  const { publicProfile, isLoading, error, fetchProfile, clearPublicProfile } = useProfilesStore();
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    fetchProfile(userId);
    reviewsApi.getUserReviews(userId).then((data) => setReviews(data.reviews)).catch(() => {});
    return () => {
      clearPublicProfile();
    };
  }, [userId, fetchProfile, clearPublicProfile]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">{t('loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
        <Link href={`/${locale}/jobs`}>
          <Button>{t('backToJobs')}</Button>
        </Link>
      </div>
    );
  }

  if (!publicProfile) {
    return (
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
          {t('profileNotFound')}
        </div>
        <Link href={`/${locale}/jobs`}>
          <Button>{t('backToJobs')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ProfileCard profile={publicProfile} locale={locale} isOwnProfile={false} />

      {/* Reviews Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4 text-[#2C2C2C]" style={{ fontFamily: 'Cairo, sans-serif' }}>{tReviews('reviews')}</h2>
        <ReviewsList reviews={reviews} locale={locale} />
      </div>
    </div>
  );
}
