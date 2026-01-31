'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Job } from '@/lib/api/jobs';
import { useAuthStore } from '@/lib/stores/auth.store';
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

  if (!user) return null;

  const isOwner = user.id === job.clientId;
  const isClient = user.role === 'CLIENT';
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
              <Button>
                {t('viewProposals')} ({job.proposalCount})
              </Button>
            </Link>
          )}
          {job.status === 'OPEN' && (
            <Button variant="ghost" onClick={() => {/* TODO: Close job */}}>
              {t('closeJob')}
            </Button>
          )}
        </>
      )}

      {/* FREELANCER Actions */}
      {isFreelancer && !isOwner && job.status === 'OPEN' && (
        <>
          <Link href={`/${locale}/jobs/${job.id}/submit-proposal`}>
            <Button>{t('submitProposal')}</Button>
          </Link>
          <Button variant="outline" onClick={() => {/* TODO: Save job */}}>
            {t('saveJob')}
          </Button>
        </>
      )}

      {/* Message Button (for non-owners) */}
      {!isOwner && job.client && (
        <Button variant="outline" onClick={() => {/* TODO: Start message thread */}}>
          {t('messageClient')}
        </Button>
      )}
    </div>
  );
}
