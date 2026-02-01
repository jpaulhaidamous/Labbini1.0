'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useProfilesStore } from '@/lib/stores/profiles.store';
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';
import ProfileCard from '@/components/profile/ProfileCard';

interface ProfileViewProps {
  locale: string;
}

export default function ProfileView({ locale }: ProfileViewProps) {
  const t = useTranslations('profile');
  const { user, isReady } = useAuthGuard(locale);
  const { myProfile, isLoading, error, fetchMyProfile } = useProfilesStore();

  useEffect(() => {
    if (!isReady) return;
    fetchMyProfile();
  }, [isReady, fetchMyProfile]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">{t('loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  if (!myProfile) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
        {t('noProfile')}
      </div>
    );
  }

  return <ProfileCard profile={myProfile} locale={locale} isOwnProfile={true} />;
}
