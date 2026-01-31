'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useProfilesStore } from '@/lib/stores/profiles.store';
import ProfileCard from '@/components/profile/ProfileCard';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface PublicProfileViewProps {
  locale: string;
  userId: string;
}

export default function PublicProfileView({ locale, userId }: PublicProfileViewProps) {
  const t = useTranslations('profile');
  const { publicProfile, isLoading, error, fetchProfile, clearPublicProfile } = useProfilesStore();

  useEffect(() => {
    fetchProfile(userId);
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

      {/* Reviews Section - Placeholder for Phase 8 */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">{t('reviews')}</h2>
        <div className="bg-gray-50 border border-gray-200 rounded p-8 text-center text-gray-500">
          {t('noReviewsYet')}
        </div>
      </div>
    </div>
  );
}
