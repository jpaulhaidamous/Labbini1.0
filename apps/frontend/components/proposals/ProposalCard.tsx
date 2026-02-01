'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Proposal } from '@/lib/api/proposals';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMessagesStore } from '@/lib/stores/messages.store';
import Link from 'next/link';

interface ProposalCardProps {
  proposal: Proposal;
  locale: string;
  showActions?: boolean;
  onUpdateStatus?: (proposalId: string, status: 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED') => void;
  onWithdraw?: (proposalId: string) => void;
}

export default function ProposalCard({
  proposal,
  locale,
  showActions = true,
  onUpdateStatus,
  onWithdraw,
}: ProposalCardProps) {
  const t = useTranslations('proposals');
  const tMessages = useTranslations('messages');
  const router = useRouter();
  const { createThread } = useMessagesStore();

  const handleMessage = async () => {
    if (!proposal.freelancerId) return;
    try {
      const thread = await createThread({ participantIds: [proposal.freelancerId] });
      router.push(`/${locale}/messages/${thread.id}`);
    } catch {
      console.error('Failed to create message thread');
    }
  };

  const freelancerName =
    locale === 'ar' && proposal.freelancer?.profile?.displayNameAr
      ? proposal.freelancer.profile.displayNameAr
      : proposal.freelancer?.profile?.displayNameEn ||
        proposal.freelancer?.email.split('@')[0] ||
        'Unknown';

  const coverLetter =
    locale === 'ar' && proposal.coverLetterAr ? proposal.coverLetterAr : proposal.coverLetterEn;

  const getStatusBadge = () => {
    const statusMap: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
      PENDING: 'default',
      SHORTLISTED: 'info',
      ACCEPTED: 'success',
      REJECTED: 'error',
      WITHDRAWN: 'default',
    };
    return (
      <Badge variant={statusMap[proposal.status] || 'default'}>
        {t(proposal.status.toLowerCase() as any)}
      </Badge>
    );
  };

  const getDurationLabel = () => {
    const unitMap: Record<string, string> = {
      HOURS: t('hours'),
      DAYS: t('days'),
      WEEKS: t('weeks'),
      MONTHS: t('months'),
    };
    return `${proposal.proposedDuration} ${unitMap[proposal.durationUnit] || ''}`;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1">
            {/* Avatar */}
            <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shrink-0">
              {proposal.freelancer?.profile?.avatarUrl ? (
                <img
                  src={proposal.freelancer.profile.avatarUrl}
                  alt={freelancerName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-lg text-gray-400">
                  {freelancerName.charAt(0).toUpperCase()}
                </span>
              )}
            </div>

            {/* Name and Info */}
            <div>
              <Link
                href={`/${locale}/profile/${proposal.freelancerId}`}
                className="font-semibold hover:text-primary"
              >
                {freelancerName}
              </Link>
              <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                {proposal.freelancer?.profile && (
                  <>
                    <span>{proposal.freelancer.profile.jobSuccessScore}% {t('success')}</span>
                    <span>•</span>
                    <span>{proposal.freelancer.profile.totalJobsCompleted} {t('jobsDone')}</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Status */}
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Cover Letter */}
        <p className="text-gray-700 whitespace-pre-wrap line-clamp-4">{coverLetter}</p>

        {/* Rate and Duration */}
        <div className="flex gap-6 pt-2 border-t">
          <div>
            <p className="text-sm text-gray-600">{t('proposedRate')}</p>
            <p className="text-xl font-bold text-primary">${proposal.proposedRate.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">{t('estimatedDuration')}</p>
            <p className="font-semibold">{getDurationLabel()}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">{t('submitted')}</p>
            <p className="font-semibold">{new Date(proposal.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex flex-wrap gap-2 pt-2">
            {/* Client Actions */}
            {onUpdateStatus && proposal.status === 'PENDING' && (
              <>
                <Button
                  variant="outline"
                  onClick={() => onUpdateStatus(proposal.id, 'SHORTLISTED')}
                >
                  {t('shortlist')}
                </Button>
                <Button onClick={() => onUpdateStatus(proposal.id, 'ACCEPTED')}>
                  {t('accept')}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => onUpdateStatus(proposal.id, 'REJECTED')}
                  className="text-red-600 hover:text-red-700"
                >
                  {t('reject')}
                </Button>
              </>
            )}
            {onUpdateStatus && proposal.status === 'SHORTLISTED' && (
              <>
                <Button onClick={() => onUpdateStatus(proposal.id, 'ACCEPTED')}>
                  {t('accept')}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => onUpdateStatus(proposal.id, 'REJECTED')}
                  className="text-red-600 hover:text-red-700"
                >
                  {t('reject')}
                </Button>
              </>
            )}

            {/* Freelancer Actions */}
            {onWithdraw && proposal.status === 'PENDING' && (
              <Button
                variant="ghost"
                onClick={() => onWithdraw(proposal.id)}
                className="text-red-600 hover:text-red-700"
              >
                {t('withdraw')}
              </Button>
            )}

            {/* Message Freelancer */}
            {onUpdateStatus && (
              <Button variant="outline" onClick={handleMessage}>
                {tMessages('newMessage')}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
