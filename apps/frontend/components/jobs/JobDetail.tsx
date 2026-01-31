'use client';

import { useTranslations } from 'next-intl';
import { Job } from '@/lib/api/jobs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import JobActions from './JobActions';
import Link from 'next/link';

interface JobDetailProps {
  job: Job;
  locale: string;
}

export default function JobDetail({ job, locale }: JobDetailProps) {
  const t = useTranslations('jobs');
  const tCommon = useTranslations('common');

  const jobTitle = locale === 'ar' && job.titleAr ? job.titleAr : job.titleEn;
  const jobDescription =
    locale === 'ar' && job.descriptionAr ? job.descriptionAr : job.descriptionEn;
  const categoryName =
    locale === 'ar' && job.category?.nameAr ? job.category.nameAr : job.category?.nameEn || '';

  const clientName =
    locale === 'ar' && job.client?.profile?.displayNameAr
      ? job.client.profile.displayNameAr
      : job.client?.profile?.displayNameEn || job.client?.email.split('@')[0];

  const formatBudget = () => {
    if (job.budgetType === 'FIXED' && job.budgetFixed) {
      return `$${job.budgetFixed.toLocaleString()}`;
    }
    if (job.budgetType === 'RANGE' && job.budgetMin && job.budgetMax) {
      return `$${job.budgetMin.toLocaleString()} - $${job.budgetMax.toLocaleString()}`;
    }
    if (job.budgetType === 'HOURLY' && job.budgetHourly) {
      return `$${job.budgetHourly}/hr`;
    }
    return 'N/A';
  };

  const getStatusBadge = () => {
    const statusMap: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
      DRAFT: 'default',
      OPEN: 'success',
      IN_PROGRESS: 'info',
      COMPLETED: 'default',
      CANCELLED: 'error',
    };
    return (
      <Badge variant={statusMap[job.status] || 'default'}>
        {t(job.status.toLowerCase() as any)}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-3xl">{jobTitle}</CardTitle>
                {getStatusBadge()}
                {job.isUrgent && <Badge variant="error">{t('urgent')}</Badge>}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>{categoryName}</span>
                <span>•</span>
                <span>{t(job.jobType.toLowerCase() as any)}</span>
                <span>•</span>
                <span>
                  {t('posted')} {new Date(job.createdAt).toLocaleDateString()}
                </span>
                <span>•</span>
                <span>
                  {job.proposalCount} {t('proposals')}
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <JobActions job={job} locale={locale} />
        </CardContent>
      </Card>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Job Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>{t('jobDescription')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap text-gray-700">{jobDescription}</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Additional Info */}
        <div className="space-y-6">
          {/* Budget */}
          <Card>
            <CardHeader>
              <CardTitle>{t('budget')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">{formatBudget()}</p>
              <p className="text-sm text-gray-600 mt-1">
                {job.budgetType === 'FIXED' && t('fixedPrice')}
                {job.budgetType === 'RANGE' && t('budgetRange')}
                {job.budgetType === 'HOURLY' && t('hourly')}
              </p>
            </CardContent>
          </Card>

          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle>{t('location')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">{t('locationType')}:</span>
                  <p className="font-medium">
                    {job.locationType === 'REMOTE' && t('remote')}
                    {job.locationType === 'ONSITE' && t('onsite')}
                    {job.locationType === 'HYBRID' && t('hybrid')}
                  </p>
                </div>
                {(job.locationType === 'ONSITE' || job.locationType === 'HYBRID') &&
                  job.governorate && (
                    <div>
                      <span className="text-sm text-gray-600">{t('governorate')}:</span>
                      <p className="font-medium">
                        {job.governorate}
                        {job.city && `, ${job.city}`}
                      </p>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>

          {/* Client Info */}
          {job.client && (
            <Card>
              <CardHeader>
                <CardTitle>{t('aboutClient')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
                    {job.client.profile?.avatarUrl ? (
                      <img
                        src={job.client.profile.avatarUrl}
                        alt={clientName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xl text-gray-400">
                        {(clientName || 'U').charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div>
                    <Link
                      href={`/${locale}/profile/${job.clientId}`}
                      className="font-medium hover:text-primary"
                    >
                      {clientName || 'Unknown'}
                    </Link>
                    <p className="text-sm text-gray-600">{tCommon('client')}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats */}
          <Card>
            <CardHeader>
              <CardTitle>{t('jobStats')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('views')}:</span>
                <span className="font-medium">{job.viewCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">{t('proposals')}:</span>
                <span className="font-medium">{job.proposalCount}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
