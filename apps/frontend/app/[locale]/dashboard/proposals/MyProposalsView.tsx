'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useProposalsStore } from '@/lib/stores/proposals.store';
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';
import ProposalsList from '@/components/proposals/ProposalsList';

interface MyProposalsViewProps {
  locale: string;
}

export default function MyProposalsView({ locale }: MyProposalsViewProps) {
  const t = useTranslations('proposals');
  const router = useRouter();
  const { user, isReady } = useAuthGuard(locale);
  const { myProposals, isLoading, error, fetchMyProposals, withdrawProposal } =
    useProposalsStore();

  useEffect(() => {
    if (!isReady || !user) return;
    if (user.role !== 'FREELANCER') {
      router.push(`/${locale}/dashboard`);
      return;
    }
    fetchMyProposals();
  }, [isReady, user, locale, router, fetchMyProposals]);

  const handleWithdraw = async (proposalId: string) => {
    if (confirm(t('confirmWithdraw'))) {
      try {
        await withdrawProposal(proposalId);
        await fetchMyProposals(); // Refresh
      } catch (error) {
        console.error('Failed to withdraw proposal:', error);
      }
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

  return (
    <ProposalsList
      proposals={myProposals}
      locale={locale}
      onWithdraw={handleWithdraw}
    />
  );
}
