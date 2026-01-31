'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useJobsStore } from '@/lib/stores/jobs.store';
import { useAuthStore } from '@/lib/stores/auth.store';
import MyJobsList from '@/components/dashboard/MyJobsList';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface MyJobsViewProps {
  locale: string;
}

export default function MyJobsView({ locale }: MyJobsViewProps) {
  const t = useTranslations('jobs');
  const router = useRouter();
  const { user } = useAuthStore();
  const { myJobs, isLoading, error, fetchMyJobs, updateJob } = useJobsStore();

  useEffect(() => {
    if (!user) {
      router.push(`/${locale}/login`);
      return;
    }
    if (user.role !== 'CLIENT') {
      router.push(`/${locale}/dashboard`);
      return;
    }
    fetchMyJobs();
  }, [user, locale, router, fetchMyJobs]);

  const handleCloseJob = async (jobId: string) => {
    if (confirm(t('confirmCloseJob'))) {
      try {
        await updateJob(jobId, { status: 'CANCELLED' });
        await fetchMyJobs(); // Refresh the list
      } catch (error) {
        console.error('Failed to close job:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">{t('loadingJobs')}</div>
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

  return (
    <div className="space-y-6">
      {/* Action Bar */}
      <div className="flex justify-end">
        <Link href={`/${locale}/jobs/post`}>
          <Button>{t('postNewJob')}</Button>
        </Link>
      </div>

      {/* Jobs List */}
      <MyJobsList jobs={myJobs} locale={locale} onCloseJob={handleCloseJob} />
    </div>
  );
}
