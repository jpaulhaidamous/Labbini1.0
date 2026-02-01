'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Job } from '@/lib/api/jobs';
import { useAuthStore } from '@/lib/stores/auth.store';
import { useJobsStore } from '@/lib/stores/jobs.store';
import { useMessagesStore } from '@/lib/stores/messages.store';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface JobActionsProps {
  job: Job;
  locale: string;
}

export default function JobActions({ job, locale }: JobActionsProps) {
  const t = useTranslations('jobs');
  const router = useRouter();
  const { user } = useAuthStore();
  const { updateJob } = useJobsStore();
  const { createThread } = useMessagesStore();
  const [isClosing, setIsClosing] = useState(false);
  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const handleMessageClient = async () => {
    if (!job.clientId) return;
    try {
      const thread = await createThread({ participantIds: [job.clientId], jobId: job.id });
      router.push(`/${locale}/messages/${thread.id}`);
    } catch {
      console.error('Failed to create message thread');
    }
  };

  const handleCloseJob = async () => {
    setIsClosing(true);
    try {
      await updateJob(job.id, { status: 'CANCELLED' });
      router.push(`/${locale}/dashboard/jobs`);
    } catch {
      console.error('Failed to close job');
    } finally {
      setIsClosing(false);
      setShowCloseConfirm(false);
    }
  };

  if (!user) return null;

  const isOwner = user.id === job.clientId;
  const isFreelancer = user.role === 'FREELANCER';

  return (
    <div className="flex flex-wrap gap-3">
      {/* CLIENT Actions (Job Owner) */}
      {isOwner && (
        <>
          <Link href={`/${locale}/jobs/${job.id}/edit`}>
            <Button variant="outline">{t('editJob')}</Button>
          </Link>
          {job.status === 'OPEN' && (
            <Link href={`/${locale}/jobs/${job.id}/proposals`}>
              <Button className="bg-[#1B5E4A] hover:bg-[#2D7A62] text-white">
                {t('viewProposals')} ({job.proposalCount ?? 0})
              </Button>
            </Link>
          )}
          {job.status === 'OPEN' && !showCloseConfirm && (
            <Button variant="ghost" onClick={() => setShowCloseConfirm(true)}>
              {t('closeJob')}
            </Button>
          )}
          {showCloseConfirm && (
            <div className="w-full mt-2 bg-red-50 border border-red-200 rounded-lg p-4 space-y-3">
              <p className="text-red-800 text-sm">{t('confirmCloseJob')}</p>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={isClosing}
                  onClick={handleCloseJob}
                >
                  {isClosing ? '...' : t('closeJob')}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowCloseConfirm(false)}>
                  {t('cancel') || 'Cancel'}
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* FREELANCER Actions */}
      {isFreelancer && !isOwner && job.status === 'OPEN' && (
        <Link href={`/${locale}/jobs/${job.id}/submit-proposal`}>
          <Button className="bg-[#1B5E4A] hover:bg-[#2D7A62] text-white">{t('submitProposal')}</Button>
        </Link>
      )}

      {/* Message Button (for non-owners) */}
      {!isOwner && job.clientId && (
        <Button variant="outline" onClick={handleMessageClient}>
          {t('messageClient')}
        </Button>
      )}
    </div>
  );
}
