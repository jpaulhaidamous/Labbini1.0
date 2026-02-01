'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Contract } from '@/lib/api/contracts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useMessagesStore } from '@/lib/stores/messages.store';
import MilestonesList from './MilestonesList';
import Link from 'next/link';

interface ContractDetailProps {
  contract: Contract;
  locale: string;
  isClient: boolean;
  isFreelancer: boolean;
  onSubmitMilestone?: (milestoneId: string) => void;
  onApproveMilestone?: (milestoneId: string) => void;
  onFundMilestone?: (milestoneId: string, paymentMethod: string, referenceNumber: string) => Promise<void>;
}

export default function ContractDetail({
  contract,
  locale,
  isClient,
  isFreelancer,
  onSubmitMilestone,
  onApproveMilestone,
  onFundMilestone,
}: ContractDetailProps) {
  const t = useTranslations('contracts');
  const tCommon = useTranslations('common');
  const tMessages = useTranslations('messages');
  const router = useRouter();
  const { createThread } = useMessagesStore();

  const handleMessage = async () => {
    const otherPartyId = isClient ? contract.freelancerId : contract.clientId;
    try {
      const thread = await createThread({ participantIds: [otherPartyId], contractId: contract.id });
      router.push(`/${locale}/messages/${thread.id}`);
    } catch {
      console.error('Failed to create message thread');
    }
  };

  const getStatusBadge = () => {
    const statusMap: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
      PENDING: 'default',
      ACTIVE: 'success',
      PAUSED: 'warning',
      COMPLETED: 'default',
      CANCELLED: 'error',
      DISPUTED: 'error',
    };
    return (
      <Badge variant={statusMap[contract.status] || 'default'}>
        {t(contract.status.toLowerCase() as any)}
      </Badge>
    );
  };

  const jobTitle =
    locale === 'ar' && contract.job?.titleAr ? contract.job.titleAr : contract.job?.titleEn;

  const getPartyName = (party: Contract['client'] | Contract['freelancer']) => {
    if (!party) return 'Unknown';
    const name =
      locale === 'ar' && party.profile?.displayNameAr
        ? party.profile.displayNameAr
        : party.profile?.displayNameEn || party.email.split('@')[0];
    return name;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <CardTitle className="text-2xl">{t('contract')}</CardTitle>
                {getStatusBadge()}
              </div>
              {jobTitle && (
                <Link href={`/${locale}/jobs/${contract.jobId}`} className="text-primary hover:underline text-sm">
                  {jobTitle}
                </Link>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Contract Info */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">{t('contractType')}:</span>
                <span className="font-medium">
                  {contract.contractType === 'FIXED' ? t('fixedPrice') : t('hourly')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('agreedRate')}:</span>
                <span className="font-medium text-primary">
                  ${contract.agreedRate.toLocaleString()}
                  {contract.contractType === 'HOURLY' && '/hr'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('totalValue')}:</span>
                <span className="font-bold text-primary">
                  ${contract.totalValue.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">{t('startDate')}:</span>
                <span className="font-medium">
                  {new Date(contract.startDate).toLocaleDateString()}
                </span>
              </div>
              {contract.endDate && (
                <div className="flex justify-between">
                  <span className="text-gray-600">{t('endDate')}:</span>
                  <span className="font-medium">
                    {new Date(contract.endDate).toLocaleDateString()}
                  </span>
                </div>
              )}
            </div>

            {/* Parties */}
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">{tCommon('client')}</p>
                <p className="font-medium">{getPartyName(contract.client)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">{tCommon('freelancer')}</p>
                <p className="font-medium">{getPartyName(contract.freelancer)}</p>
              </div>
              <Button variant="outline" onClick={handleMessage} className="mt-2">
                {tMessages('newMessage')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Milestones */}
      <Card>
        <CardHeader>
          <CardTitle>{t('milestones')}</CardTitle>
        </CardHeader>
        <CardContent>
          <MilestonesList
            milestones={contract.milestones || []}
            isClient={isClient}
            isFreelancer={isFreelancer}
            onSubmit={onSubmitMilestone}
            onApprove={onApproveMilestone}
            onFund={onFundMilestone}
          />
        </CardContent>
      </Card>

      {/* Leave Review (when contract is completed) */}
      {contract.status === 'COMPLETED' && (
        <Link href={`/${locale}/contracts/${contract.id}/review`}>
          <Button variant="outline" className="w-full">
            {t('leaveReview')}
          </Button>
        </Link>
      )}
    </div>
  );
}
