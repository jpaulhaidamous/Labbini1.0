'use client';

import { useTranslations } from 'next-intl';
import { Milestone } from '@/lib/api/contracts';
import MilestoneCard from './MilestoneCard';

interface MilestonesListProps {
  milestones: Milestone[];
  isClient: boolean;
  isFreelancer: boolean;
  onSubmit?: (milestoneId: string) => void;
  onApprove?: (milestoneId: string) => void;
  onFund?: (milestoneId: string, paymentMethod: string, referenceNumber: string) => Promise<void>;
}

export default function MilestonesList({
  milestones,
  isClient,
  isFreelancer,
  onSubmit,
  onApprove,
  onFund,
}: MilestonesListProps) {
  const t = useTranslations('contracts');

  // Calculate progress
  const completedMilestones = milestones.filter((m) => m.status === 'APPROVED').length;
  const totalMilestones = milestones.length;
  const progressPercent = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;
  const totalValue = milestones.reduce((sum, m) => sum + m.amount, 0);
  const fundedValue = milestones
    .filter((m) => ['FUNDED', 'IN_PROGRESS', 'SUBMITTED', 'APPROVED'].includes(m.status))
    .reduce((sum, m) => sum + m.amount, 0);

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      {totalMilestones > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>
              {completedMilestones}/{totalMilestones} {t('milestonesCompleted')}
            </span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-primary h-3 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>
              {t('funded')}: ${fundedValue.toLocaleString()} / ${totalValue.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* Milestones */}
      {milestones.length === 0 ? (
        <p className="text-center text-gray-500 py-6">{t('noMilestones')}</p>
      ) : (
        <div className="space-y-3">
          {milestones.map((milestone) => (
            <MilestoneCard
              key={milestone.id}
              milestone={milestone}
              isClient={isClient}
              isFreelancer={isFreelancer}
              onSubmit={onSubmit}
              onApprove={onApprove}
              onFund={onFund}
            />
          ))}
        </div>
      )}
    </div>
  );
}
