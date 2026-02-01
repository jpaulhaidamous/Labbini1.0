'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Milestone } from '@/lib/api/contracts';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import FundMilestoneModal from './FundMilestoneModal';

interface MilestoneCardProps {
  milestone: Milestone;
  isClient: boolean;
  isFreelancer: boolean;
  onSubmit?: (milestoneId: string) => void;
  onApprove?: (milestoneId: string) => void;
  onFund?: (milestoneId: string, paymentMethod: string, referenceNumber: string) => Promise<void>;
}

export default function MilestoneCard({
  milestone,
  isClient,
  isFreelancer,
  onSubmit,
  onApprove,
  onFund,
}: MilestoneCardProps) {
  const t = useTranslations('contracts');
  const [showFundModal, setShowFundModal] = useState(false);

  const getStatusBadge = () => {
    const statusMap: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
      PENDING: 'default',
      FUNDED: 'info',
      IN_PROGRESS: 'info',
      SUBMITTED: 'warning',
      APPROVED: 'success',
      DISPUTED: 'error',
    };
    return (
      <Badge variant={statusMap[milestone.status] || 'default'}>
        {t(milestone.status.toLowerCase() as any)}
      </Badge>
    );
  };

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-lg">{milestone.name}</h3>
                {getStatusBadge()}
              </div>
              {milestone.description && (
                <p className="text-gray-600 text-sm mb-2">{milestone.description}</p>
              )}
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="font-semibold text-primary text-base">
                  ${milestone.amount.toLocaleString()}
                </span>
                {milestone.dueDate && (
                  <span>
                    {t('dueDate')}: {new Date(milestone.dueDate).toLocaleDateString()}
                  </span>
                )}
                {milestone.fundedAt && (
                  <span>
                    {t('funded')}: {new Date(milestone.fundedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 ml-4">
              {/* Client: Fund milestone */}
              {isClient && milestone.status === 'PENDING' && onFund && (
                <Button onClick={() => setShowFundModal(true)}>{t('fund')}</Button>
              )}

              {/* Client: Approve milestone */}
              {isClient && milestone.status === 'SUBMITTED' && onApprove && (
                <Button onClick={() => onApprove(milestone.id)}>{t('approve')}</Button>
              )}

              {/* Freelancer: Submit milestone */}
              {isFreelancer &&
                (milestone.status === 'FUNDED' || milestone.status === 'IN_PROGRESS') &&
                onSubmit && (
                  <Button onClick={() => onSubmit(milestone.id)}>{t('submitWork')}</Button>
                )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fund Modal */}
      {showFundModal && onFund && (
        <FundMilestoneModal
          milestone={milestone}
          onFund={(paymentMethod, referenceNumber) =>
            onFund(milestone.id, paymentMethod, referenceNumber)
          }
          onClose={() => setShowFundModal(false)}
        />
      )}
    </>
  );
}
