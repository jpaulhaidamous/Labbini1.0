'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useProfilesStore } from '@/lib/stores/profiles.store';
import { useAuthStore } from '@/lib/stores/auth.store';
import ProfileEditForm from '@/components/profile/ProfileEditForm';

interface ProfileEditViewProps {
  locale: string;
}

export default function ProfileEditView({ locale }: ProfileEditViewProps) {
  const t = useTranslations('profile');
  const router = useRouter();
  const { user } = useAuthStore();
  const { myProfile, isLoading, error, fetchMyProfile } = useProfilesStore();

  useEffect(() => {
    if (!user) {
      router.push(`/${locale}/login`);
      return;
    }
    if (!myProfile) {
      fetchMyProfile();
    }
  }, [user, myProfile, locale, router, fetchMyProfile]);

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
