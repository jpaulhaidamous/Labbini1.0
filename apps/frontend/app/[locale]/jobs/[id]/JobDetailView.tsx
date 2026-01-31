'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useJobsStore } from '@/lib/stores/jobs.store';
import JobDetail from '@/components/jobs/JobDetail';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface JobDetailViewProps {
  locale: string;
  jobId: string;
}

export default function JobDetailView({ locale, jobId }: JobDetailViewProps) {
  const t = useTranslations('jobs');
  const router = useRouter();
  const { currentJob, isLoading, error, fetchJob, clearCurrentJob } = useJobsStore();

  useEffect(() => {
    fetchJob(jobId);
    return () => {
      clearCurrentJob();
    };
  }, [jobId, fetchJob, clearCurrentJob]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">{t('loadingJob')}</div>
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

  if (!currentJob) {
    return (
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
          {t('jobNotFound')}
        </div>
        <Link href={`/${locale}/jobs`}>
          <Button>{t('backToJobs')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link href={`/${locale}/jobs`} className="text-primary hover:underline">
          ← {t('backToJobs')}
        </Link>
      </div>
      <JobDetail job={currentJob} locale={locale} />
    </div>
  );
}
