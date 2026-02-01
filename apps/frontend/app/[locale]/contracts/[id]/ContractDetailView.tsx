'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useContractsStore } from '@/lib/stores/contracts.store';
import { usePaymentsStore } from '@/lib/stores/payments.store';
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';
import ContractDetail from '@/components/contracts/ContractDetail';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface ContractDetailViewProps {
  locale: string;
  contractId: string;
}

export default function ContractDetailView({ locale, contractId }: ContractDetailViewProps) {
  const t = useTranslations('contracts');
  const router = useRouter();
  const { user, isReady } = useAuthGuard(locale);
  const { currentContract, isLoading, error, fetchContract, submitMilestone, approveMilestone } =
    useContractsStore();
  const { fundMilestone } = usePaymentsStore();

  useEffect(() => {
    if (!isReady) return;
    fetchContract(contractId);
  }, [isReady, contractId, fetchContract]);

  const handleSubmitMilestone = async (milestoneId: string) => {
    try {
      await submitMilestone(milestoneId);
      await fetchContract(contractId);
    } catch (error) {
      console.error('Failed to submit milestone:', error);
    }
  };

  const handleApproveMilestone = async (milestoneId: string) => {
    try {
      await approveMilestone(milestoneId);
      await fetchContract(contractId);
    } catch (error) {
      console.error('Failed to approve milestone:', error);
    }
  };

  const handleFundMilestone = async (milestoneId: string, paymentMethod: string, referenceNumber: string) => {
    try {
      await fundMilestone(milestoneId, {
        paymentMethod: paymentMethod as 'OMT' | 'WHISH' | 'WALLET',
        externalReference: referenceNumber || undefined,
      });
      await fetchContract(contractId);
    } catch (error) {
      console.error('Failed to fund milestone:', error);
    }
  };

  if (isLoading || !currentContract) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">{t('loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
        <Link href={`/${locale}/dashboard/contracts`}>
          <Button>{t('backToContracts')}</Button>
        </Link>
      </div>
    );
  }

  const isClient = user?.id === currentContract.clientId;
  const isFreelancer = user?.id === currentContract.freelancerId;

  return (
    <div>
      <div className="mb-6">
        <Link href={`/${locale}/dashboard/contracts`} className="text-[#1B5E4A] hover:underline">
          ← {t('backToContracts')}
        </Link>
      </div>
      <ContractDetail
        contract={currentContract}
        locale={locale}
        isClient={isClient}
        isFreelancer={isFreelancer}
        onSubmitMilestone={handleSubmitMilestone}
        onApproveMilestone={handleApproveMilestone}
        onFundMilestone={handleFundMilestone}
      />
    </div>
  );
}
