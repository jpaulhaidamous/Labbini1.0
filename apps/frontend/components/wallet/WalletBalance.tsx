'use client';

import { useTranslations } from 'next-intl';
import { Wallet } from '@/lib/api/payments';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface WalletBalanceProps {
  wallet: Wallet;
  onWithdraw: () => void;
}

export default function WalletBalance({ wallet, onWithdraw }: WalletBalanceProps) {
  const t = useTranslations('wallet');

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Available Balance */}
      <Card className="border-primary">
        <CardContent className="pt-6">
          <p className="text-sm text-gray-600 mb-1">{t('availableBalance')}</p>
          <p className="text-3xl font-bold text-primary">
            ${wallet.availableBalance.toLocaleString()}
          </p>
          <div className="mt-4">
            <Button
              onClick={onWithdraw}
              disabled={wallet.availableBalance <= 0}
              className="w-full"
            >
              {t('withdraw')}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pending Balance */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-gray-600 mb-1">{t('pendingBalance')}</p>
          <p className="text-3xl font-bold text-yellow-600">
            ${wallet.pendingBalance.toLocaleString()}
          </p>
          <p className="text-xs text-gray-500 mt-2">{t('pendingHint')}</p>
        </CardContent>
      </Card>

      {/* Lifetime Stats */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-600">{t('totalEarned')}</p>
              <p className="text-xl font-bold">${wallet.totalEarned.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">{t('totalWithdrawn')}</p>
              <p className="text-xl font-bold">${wallet.totalWithdrawn.toLocaleString()}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
