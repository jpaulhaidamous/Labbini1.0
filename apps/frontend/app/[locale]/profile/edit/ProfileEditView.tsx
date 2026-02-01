'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useProfilesStore } from '@/lib/stores/profiles.store';
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';
import ProfileEditForm from '@/components/profile/ProfileEditForm';

interface ProfileEditViewProps {
  locale: string;
}

export default function ProfileEditView({ locale }: ProfileEditViewProps) {
  const t = useTranslations('profile');
  const { user, isReady } = useAuthGuard(locale);
  const { myProfile, isLoading, error, fetchMyProfile } = useProfilesStore();

  useEffect(() => {
    if (!isReady) return;
    if (!myProfile) {
      fetchMyProfile();
    }
  }, [isReady, myProfile, fetchMyProfile]);

  if (isLoading && !myProfile) {
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

  return <ProfileEditForm locale={locale} initialProfile={myProfile} />;
}
