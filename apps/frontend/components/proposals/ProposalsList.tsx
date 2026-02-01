'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Proposal } from '@/lib/api/proposals';
import ProposalCard from './ProposalCard';

interface ProposalsListProps {
  proposals: Proposal[];
  locale: string;
  onUpdateStatus?: (proposalId: string, status: 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED') => void;
  onWithdraw?: (proposalId: string) => void;
}

type ProposalStatus = 'ALL' | 'PENDING' | 'SHORTLISTED' | 'ACCEPTED' | 'REJECTED' | 'WITHDRAWN';

export default function ProposalsList({
  proposals,
  locale,
  onUpdateStatus,
  onWithdraw,
}: ProposalsListProps) {
  const t = useTranslations('proposals');
  const [selectedStatus, setSelectedStatus] = useState<ProposalStatus>('ALL');

  const filteredProposals =
    selectedStatus === 'ALL'
      ? proposals
      : proposals.filter((p) => p.status === selectedStatus);

  const statusFilters: ProposalStatus[] = ['ALL', 'PENDING', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'];

  return (
    <div className="space-y-4">
      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((status) => {
          const count =
            status === 'ALL'
              ? proposals.length
              : proposals.filter((p) => p.status === status).length;

          return (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedStatus === status
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {t(status.toLowerCase() as any)} ({count})
            </button>
          );
        })}
      </div>

      {/* Proposals */}
      <div className="space-y-4">
        {filteredProposals.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {selectedStatus === 'ALL' ? t('noProposalsYet') : t('noProposalsInStatus')}
          </div>
        ) : (
          filteredProposals.map((proposal) => (
            <ProposalCard
              key={proposal.id}
              proposal={proposal}
              locale={locale}
              onUpdateStatus={onUpdateStatus}
              onWithdraw={onWithdraw}
            />
          ))
        )}
      </div>
    </div>
  );
}
