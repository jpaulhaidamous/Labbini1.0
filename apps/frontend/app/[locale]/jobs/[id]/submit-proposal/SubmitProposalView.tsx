'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useJobsStore } from '@/lib/stores/jobs.store';
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';
import ProposalForm from '@/components/proposals/ProposalForm';

interface SubmitProposalViewProps {
  locale: string;
  jobId: string;
}

export default function SubmitProposalView({ locale, jobId }: SubmitProposalViewProps) {
  const t = useTranslations('proposals');
  const router = useRouter();
  const { user, isReady } = useAuthGuard(locale);
  const { currentJob, isLoading, fetchJob } = useJobsStore();

  useEffect(() => {
    if (!isReady || !user) return;
    if (user.role !== 'FREELANCER') {
      router.push(`/${locale}/jobs/${jobId}`);
      return;
    }
    fetchJob(jobId);
  }, [isReady, user, jobId, locale, router, fetchJob]);

  if (isLoading || !currentJob) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">{t('loading')}</div>
      </div>
    );
  }

  const jobTitle =
    locale === 'ar' && currentJob.titleAr ? currentJob.titleAr : currentJob.titleEn;

  return (
    <ProposalForm jobId={jobId} jobTitle={jobTitle} locale={locale} />
  );
}
