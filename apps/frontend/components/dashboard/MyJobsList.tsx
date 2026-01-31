'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Job } from '@/lib/api/jobs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface MyJobsListProps {
  jobs: Job[];
  locale: string;
  onCloseJob?: (jobId: string) => void;
}

type JobStatus = 'ALL' | 'DRAFT' | 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export default function MyJobsList({ jobs, locale, onCloseJob }: MyJobsListProps) {
  const t = useTranslations('jobs');
  const [selectedStatus, setSelectedStatus] = useState<JobStatus>('ALL');

  const filteredJobs =
    selectedStatus === 'ALL' ? jobs : jobs.filter((job) => job.status === selectedStatus);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
      DRAFT: 'default',
      OPEN: 'success',
      IN_PROGRESS: 'info',
      COMPLETED: 'default',
      CANCELLED: 'error',
    };
    return (
      <Badge variant={statusMap[status] || 'default'}>{t(status.toLowerCase() as any)}</Badge>
    );
  };

  const formatBudget = (job: Job) => {
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

  const getJobsByStatus = (status: JobStatus) => {
    return status === 'ALL' ? jobs.length : jobs.filter((job) => job.status === status).length;
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card
          className={`cursor-pointer transition-colors ${
            selectedStatus === 'ALL' ? 'border-primary bg-primary/5' : ''
          }`}
          onClick={() => setSelectedStatus('ALL')}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">{getJobsByStatus('ALL')}</div>
            <div className="text-sm text-gray-600">{t('allJobs')}</div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-colors ${
            selectedStatus === 'DRAFT' ? 'border-primary bg-primary/5' : ''
          }`}
          onClick={() => setSelectedStatus('DRAFT')}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{getJobsByStatus('DRAFT')}</div>
            <div className="text-sm text-gray-600">{t('draft')}</div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-colors ${
            selectedStatus === 'OPEN' ? 'border-primary bg-primary/5' : ''
          }`}
          onClick={() => setSelectedStatus('OPEN')}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{getJobsByStatus('OPEN')}</div>
            <div className="text-sm text-gray-600">{t('open')}</div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-colors ${
            selectedStatus === 'IN_PROGRESS' ? 'border-primary bg-primary/5' : ''
          }`}
          onClick={() => setSelectedStatus('IN_PROGRESS')}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{getJobsByStatus('IN_PROGRESS')}</div>
            <div className="text-sm text-gray-600">{t('in_progress')}</div>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer transition-colors ${
            selectedStatus === 'COMPLETED' ? 'border-primary bg-primary/5' : ''
          }`}
          onClick={() => setSelectedStatus('COMPLETED')}
        >
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-gray-600">{getJobsByStatus('COMPLETED')}</div>
            <div className="text-sm text-gray-600">{t('completed')}</div>
          </CardContent>
        </Card>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-gray-500">
              {selectedStatus === 'ALL' ? t('noJobsYet') : t('noJobsInStatus')}
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map((job) => {
            const jobTitle = locale === 'ar' && job.titleAr ? job.titleAr : job.titleEn;
            const categoryName =
              locale === 'ar' && job.category?.nameAr ? job.category.nameAr : job.category?.nameEn;

            return (
              <Card key={job.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{jobTitle}</CardTitle>
                        {getStatusBadge(job.status)}
                        {job.isUrgent && <Badge variant="error">{t('urgent')}</Badge>}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        {categoryName && <span>{categoryName}</span>}
                        <span>•</span>
                        <span>{formatBudget(job)}</span>
                        <span>•</span>
                        <span>
                          {job.proposalCount} {t('proposals')}
                        </span>
                        <span>•</span>
                        <span>
                          {t('posted')} {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3">
                    <Link href={`/${locale}/jobs/${job.id}`}>
                      <Button variant="outline">{t('viewJob')}</Button>
                    </Link>

                    {job.status === 'DRAFT' && (
                      <Link href={`/${locale}/jobs/${job.id}/edit`}>
                        <Button>{t('editJob')}</Button>
                      </Link>
                    )}

                    {job.status === 'OPEN' && (
                      <>
                        <Link href={`/${locale}/jobs/${job.id}/proposals`}>
                          <Button>
                            {t('viewProposals')} ({job.proposalCount})
                          </Button>
                        </Link>
                        {onCloseJob && (
                          <Button
                            variant="ghost"
                            onClick={() => onCloseJob(job.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            {t('closeJob')}
                          </Button>
                        )}
                      </>
                    )}

                    {job.status === 'IN_PROGRESS' && (
                      <Link href={`/${locale}/contracts/${job.id}`}>
                        <Button variant="outline">{t('viewContract')}</Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
