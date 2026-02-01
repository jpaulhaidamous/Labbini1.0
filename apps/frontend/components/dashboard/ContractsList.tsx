'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Contract } from '@/lib/api/contracts';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface ContractsListProps {
  contracts: Contract[];
  locale: string;
  userRole: 'CLIENT' | 'FREELANCER';
  userId: string;
}

type ContractStatus = 'ALL' | 'PENDING' | 'ACTIVE' | 'PAUSED' | 'COMPLETED' | 'CANCELLED';

export default function ContractsList({
  contracts,
  locale,
  userRole,
  userId,
}: ContractsListProps) {
  const t = useTranslations('contracts');
  const [selectedStatus, setSelectedStatus] = useState<ContractStatus>('ALL');

  const filteredContracts =
    selectedStatus === 'ALL' ? contracts : contracts.filter((c) => c.status === selectedStatus);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
      PENDING: 'default',
      ACTIVE: 'success',
      PAUSED: 'warning',
      COMPLETED: 'default',
      CANCELLED: 'error',
    };
    return <Badge variant={statusMap[status] || 'default'}>{t(status.toLowerCase() as any)}</Badge>;
  };

  const getOtherPartyName = (contract: Contract) => {
    const party = userRole === 'CLIENT' ? contract.freelancer : contract.client;
    if (!party) return 'Unknown';
    return (
      (locale === 'ar' && party.profile?.displayNameAr) ||
      party.profile?.displayNameEn ||
      party.email.split('@')[0]
    );
  };

  const statusFilters: ContractStatus[] = ['ALL', 'ACTIVE', 'PENDING', 'COMPLETED', 'CANCELLED'];

  return (
    <div className="space-y-4">
      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        {statusFilters.map((status) => {
          const count =
            status === 'ALL'
              ? contracts.length
              : contracts.filter((c) => c.status === status).length;

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

      {/* Contracts */}
      <div className="space-y-3">
        {filteredContracts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            {selectedStatus === 'ALL' ? t('noContractsYet') : t('noContractsInStatus')}
          </div>
        ) : (
          filteredContracts.map((contract) => {
            const jobTitle =
              locale === 'ar' && contract.job?.titleAr
                ? contract.job.titleAr
                : contract.job?.titleEn;

            return (
              <Card key={contract.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">
                          {jobTitle || t('untitled')}
                        </h3>
                        {getStatusBadge(contract.status)}
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>
                          {userRole === 'CLIENT' ? t('freelancer') : t('client')}:{' '}
                          <span className="font-medium">{getOtherPartyName(contract)}</span>
                        </p>
                        <p>
                          {t('totalValue')}:{' '}
                          <span className="font-medium text-primary">
                            ${contract.totalValue.toLocaleString()}
                          </span>
                        </p>
                        <p>
                          {t('startDate')}:{' '}
                          <span className="font-medium">
                            {new Date(contract.startDate).toLocaleDateString()}
                          </span>
                        </p>
                        {contract.milestones && (
                          <p>
                            {t('milestones')}:{' '}
                            <span className="font-medium">
                              {contract.milestones.filter((m) => m.status === 'APPROVED').length}/
                              {contract.milestones.length} {t('completed')}
                            </span>
                          </p>
                        )}
                      </div>
                    </div>

                    <Link href={`/${locale}/contracts/${contract.id}`}>
                      <Button variant="outline">{t('viewContract')}</Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
