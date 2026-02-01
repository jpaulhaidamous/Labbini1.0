'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useContractsStore } from '@/lib/stores/contracts.store';
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';
import ContractsList from '@/components/dashboard/ContractsList';

interface MyContractsViewProps {
  locale: string;
}

export default function MyContractsView({ locale }: MyContractsViewProps) {
  const t = useTranslations('contracts');
  const { user, isReady } = useAuthGuard(locale);
  const { contracts, isLoading, error, fetchMyContracts } = useContractsStore();

  useEffect(() => {
    if (!isReady) return;
    fetchMyContracts();
  }, [isReady, fetchMyContracts]);

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
    <ContractsList
      contracts={contracts}
      locale={locale}
      userRole={user?.role === 'FREELANCER' ? 'FREELANCER' : 'CLIENT'}
      userId={user?.id || ''}
    />
  );
}
