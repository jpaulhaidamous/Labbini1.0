'use client';

import { useTranslations } from 'next-intl';
import { Transaction } from '@/lib/api/payments';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TransactionHistoryProps {
  transactions: Transaction[];
  onLoadMore?: () => void;
  hasMore?: boolean;
  isLoading?: boolean;
}

export default function TransactionHistory({
  transactions,
  onLoadMore,
  hasMore,
  isLoading,
}: TransactionHistoryProps) {
  const t = useTranslations('wallet');

  const getTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      DEPOSIT: t('deposit'),
      ESCROW_FUND: t('escrowFund'),
      ESCROW_RELEASE: t('escrowRelease'),
      WITHDRAWAL: t('withdrawal'),
      REFUND: t('refund'),
      FEE: t('fee'),
    };
    return typeMap[type] || type;
  };

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, 'default' | 'success' | 'warning' | 'error' | 'info'> = {
      PENDING: 'default',
      PROCESSING: 'info',
      COMPLETED: 'success',
      FAILED: 'error',
      CANCELLED: 'error',
    };
    return <Badge variant={statusMap[status] || 'default'}>{t(status.toLowerCase() as any)}</Badge>;
  };

  const isIncoming = (type: string) => {
    return ['DEPOSIT', 'ESCROW_RELEASE', 'REFUND'].includes(type);
  };

  if (transactions.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        {t('noTransactions')}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 text-gray-600">{t('type')}</th>
              <th className="text-left py-3 text-gray-600">{t('description')}</th>
              <th className="text-left py-3 text-gray-600">{t('method')}</th>
              <th className="text-left py-3 text-gray-600">{t('status')}</th>
              <th className="text-right py-3 text-gray-600">{t('amount')}</th>
              <th className="text-right py-3 text-gray-600">{t('date')}</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="py-3">
                  <span className="font-medium">{getTypeLabel(tx.type)}</span>
                </td>
                <td className="py-3 text-gray-600">
                  {tx.description || '-'}
                </td>
                <td className="py-3 text-gray-600">
                  {tx.paymentMethod || '-'}
                </td>
                <td className="py-3">{getStatusBadge(tx.status)}</td>
                <td className={`py-3 text-right font-semibold ${isIncoming(tx.type) ? 'text-green-600' : 'text-red-600'}`}>
                  {isIncoming(tx.type) ? '+' : '-'}${tx.amount.toLocaleString()}
                </td>
                <td className="py-3 text-right text-gray-600">
                  {new Date(tx.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Load More */}
      {hasMore && onLoadMore && (
        <div className="text-center pt-4">
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="text-primary hover:underline text-sm disabled:opacity-50"
          >
            {isLoading ? t('loading') : t('loadMore')}
          </button>
        </div>
      )}
    </div>
  );
}
