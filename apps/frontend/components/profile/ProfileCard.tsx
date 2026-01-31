'use client';

import { useTranslations } from 'next-intl';
import { Profile } from '@/lib/api/profiles';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ProfileCardProps {
  profile: Profile;
  locale: string;
  isOwnProfile?: boolean;
}

export default function ProfileCard({ profile, locale, isOwnProfile = false }: ProfileCardProps) {
  const t = useTranslations('profile');

  const displayName = locale === 'ar' && profile.displayNameAr
    ? profile.displayNameAr
    : profile.displayNameEn || 'No name';

  const bio = locale === 'ar' && profile.bioAr
    ? profile.bioAr
    : profile.bioEn || '';

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            {/* Avatar */}
            <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
              {profile.avatarUrl ? (
                <img src={profile.avatarUrl} alt={displayName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl text-gray-400">
                  {displayName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Name and Status */}
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{displayName}</CardTitle>
              <div className="flex items-center gap-2 mb-2">
                {profile.isAvailable ? (
                  <Badge variant="success">{t('available')}</Badge>
                ) : (
                  <Badge variant="default">{t('unavailable')}</Badge>
                )}
                {profile.profileVisibility === 'PRIVATE' && (
                  <Badge variant="warning">{t('private')}</Badge>
                )}
              </div>
              {profile.governorate && (
                <p className="text-sm text-gray-600">
                  {profile.city ? `${profile.city}, ` : ''}{profile.governorate}
                </p>
              )}
            </div>
          </div>

          {/* Edit Button */}
          {isOwnProfile && (
            <Link href={`/${locale}/profile/edit`}>
              <Button variant="outline">{t('editProfile')}</Button>
            </Link>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Bio */}
        {bio && (
          <div>
            <h3 className="font-semibold mb-2">{t('about')}</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{bio}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 py-4 border-t border-b">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {profile.jobSuccessScore}%
            </div>
            <div className="text-sm text-gray-600">{t('successScore')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {profile.totalJobsCompleted}
            </div>
            <div className="text-sm text-gray-600">{t('jobsCompleted')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              ${profile.totalEarned.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600">{t('totalEarned')}</div>
          </div>
        </div>

        {/* Skills */}
        {profile.skills && profile.skills.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">{t('skills')}</h3>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((profileSkill) => (
                <Badge key={profileSkill.id} variant="info">
                  {locale === 'ar' && profileSkill.skill.nameAr
                    ? profileSkill.skill.nameAr
                    : profileSkill.skill.nameEn}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Hourly Rate */}
        {profile.hourlyRate && (
          <div>
            <h3 className="font-semibold mb-2">{t('hourlyRate')}</h3>
            <p className="text-2xl font-bold text-primary">
              ${profile.hourlyRate}/hr
            </p>
          </div>
        )}

        {/* Languages */}
        {profile.languages && profile.languages.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">{t('languages')}</h3>
            <div className="flex flex-wrap gap-2">
              {profile.languages.map((lang) => (
                <Badge key={lang}>{lang}</Badge>
              ))}
            </div>
          </div>
        )}

        {/* Response Time */}
        {profile.responseTime && (
          <div>
            <h3 className="font-semibold mb-2">{t('avgResponseTime')}</h3>
            <p className="text-gray-700">
              {profile.responseTime < 60
                ? `${profile.responseTime} ${t('minutes')}`
                : `${Math.round(profile.responseTime / 60)} ${t('hours')}`}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
