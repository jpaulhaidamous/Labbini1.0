'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useProposalsStore } from '@/lib/stores/proposals.store';
import { useJobsStore } from '@/lib/stores/jobs.store';
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';
import ProposalsList from '@/components/proposals/ProposalsList';
import Link from 'next/link';

interface ViewProposalsViewProps {
  locale: string;
  jobId: string;
}

export default function ViewProposalsView({ locale, jobId }: ViewProposalsViewProps) {
  const t = useTranslations('proposals');
  const router = useRouter();
  const { user, isReady } = useAuthGuard(locale);
  const { currentJob, fetchJob } = useJobsStore();
  const { jobProposals, isLoading, error, fetchJobProposals, updateProposalStatus } =
    useProposalsStore();

  useEffect(() => {
    if (!isReady) return;
    fetchJob(jobId);
    fetchJobProposals(jobId);
  }, [isReady, jobId, fetchJob, fetchJobProposals]);

  // Verify the current user owns this job
  useEffect(() => {
    if (currentJob && user && currentJob.clientId !== user.id) {
      router.push(`/${locale}/jobs/${jobId}`);
    }
  }, [currentJob, user, jobId, locale, router]);

  const handleUpdateStatus = async (
    proposalId: string,
    status: 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED'
  ) => {
    try {
      await updateProposalStatus(proposalId, { status });
      await fetchJobProposals(jobId); // Refresh
    } catch (error) {
      console.error('Failed to update proposal:', error);
    }
  };

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

  const jobTitle =
    currentJob && locale === 'ar' && currentJob.titleAr ? currentJob.titleAr : currentJob?.titleEn;

  return (
    <div className="space-y-6">
      {/* Back Link and Job Title */}
      <div>
        <Link href={`/${locale}/jobs/${jobId}`} className="text-[#1B5E4A] hover:underline text-sm">
          ← {t('backToJob')}
        </Link>
        {jobTitle && <p className="text-gray-600 mt-2">{jobTitle}</p>}
      </div>

      <ProposalsList
        proposals={jobProposals}
        locale={locale}
        onUpdateStatus={handleUpdateStatus}
      />
    </div>
  );
}
