'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { usePaymentsStore } from '@/lib/stores/payments.store';
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import WalletBalance from '@/components/wallet/WalletBalance';
import TransactionHistory from '@/components/wallet/TransactionHistory';

interface WalletViewProps {
  locale: string;
}

export default function WalletView({ locale }: WalletViewProps) {
  const t = useTranslations('wallet');
  const { user, isReady } = useAuthGuard(locale);
  const { wallet, transactions, isLoading, error, fetchWallet, fetchTransactions, withdraw } =
    usePaymentsStore();

  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState<'OMT' | 'WHISH' | 'BANK_TRANSFER'>('OMT');
  const [withdrawPhone, setWithdrawPhone] = useState('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);
  const [withdrawError, setWithdrawError] = useState('');
  const [withdrawSuccess, setWithdrawSuccess] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    fetchWallet();
    fetchTransactions();
  }, [isReady, fetchWallet, fetchTransactions]);

  const resetWithdrawModal = () => {
    setShowWithdrawModal(false);
    setWithdrawAmount('');
    setWithdrawPhone('');
    setWithdrawError('');
    setWithdrawSuccess(false);
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount <= 0) {
      setWithdrawError('Please enter a valid amount');
      return;
    }
    if (wallet && amount > wallet.availableBalance) {
      setWithdrawError('Amount exceeds available balance');
      return;
    }
    if (!withdrawPhone.trim()) {
      setWithdrawError('Please enter your phone number');
      return;
    }

    setIsWithdrawing(true);
    setWithdrawError('');

    try {
      await withdraw({
        amount,
        paymentMethod: withdrawMethod,
        accountDetails: { phone: withdrawPhone.trim() },
      });
      setWithdrawSuccess(true);
    } catch {
      setWithdrawError('Failed to process withdrawal. Please try again.');
    } finally {
      setIsWithdrawing(false);
    }
  };

  if (isLoading && !wallet) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[#5A5A5A]">{t('loading')}</div>
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
    <div className="space-y-6">
      {wallet && (
        <WalletBalance wallet={wallet} onWithdraw={() => setShowWithdrawModal(true)} />
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-[#1B5E4A]" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('transactionHistory')}</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionHistory transactions={transactions} />
        </CardContent>
      </Card>

      {showWithdrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={resetWithdrawModal} />
          <div className="relative z-50 bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6 space-y-5">
            <h2 className="text-xl font-bold text-[#2C2C2C]" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('withdrawFunds')}</h2>

            {withdrawSuccess ? (
              <div className="text-center py-6">
                <div className="text-green-600 text-lg font-semibold mb-2">✓ {t('withdrawRequested')}</div>
                <p className="text-[#5A5A5A] text-sm">{t('withdrawPending')}</p>
                <Button className="mt-4 bg-[#1B5E4A] hover:bg-[#2D7A62] text-white" onClick={resetWithdrawModal}>
                  {t('close')}
                </Button>
              </div>
            ) : (
              <>
                <div className="bg-[#F5EDE3] rounded-lg p-4 text-center">
                  <p className="text-sm text-[#5A5A5A]">{t('availableBalance')}</p>
                  <p className="text-2xl font-bold text-[#1B5E4A]" style={{ fontFamily: 'Cairo, sans-serif' }}>
                    ${(wallet?.availableBalance ?? 0).toLocaleString()}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5A5A5A] mb-1">{t('amount')}</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    className="border-[#F5EDE3] focus:border-[#1B5E4A]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5A5A5A] mb-2">{t('method')}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['OMT', 'WHISH', 'BANK_TRANSFER'] as const).map((method) => (
                      <button
                        key={method}
                        type="button"
                        onClick={() => setWithdrawMethod(method)}
                        className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                          withdrawMethod === method
                            ? 'border-[#1B5E4A] bg-[#1B5E4A] text-white'
                            : 'border-[#F5EDE3] text-[#5A5A5A] hover:border-[#1B5E4A]'
                        }`}
                      >
                        {method === 'BANK_TRANSFER' ? 'Bank' : method}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#5A5A5A] mb-1">
                    {withdrawMethod === 'BANK_TRANSFER' ? 'Account Number' : 'Phone Number'}
                  </label>
                  <Input
                    type="text"
                    placeholder={withdrawMethod === 'BANK_TRANSFER' ? 'Account number' : '+961XXXXXXXX'}
                    value={withdrawPhone}
                    onChange={(e) => setWithdrawPhone(e.target.value)}
                    className="border-[#F5EDE3] focus:border-[#1B5E4A]"
                  />
                </div>

                {withdrawError && (
                  <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded text-sm">
                    {withdrawError}
                  </div>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1 border-[#F5EDE3]" onClick={resetWithdrawModal}>
                    {t('close')}
                  </Button>
                  <Button
                    className="flex-1 bg-[#1B5E4A] hover:bg-[#2D7A62] text-white"
                    disabled={isWithdrawing}
                    onClick={handleWithdraw}
                  >
                    {isWithdrawing ? '...' : t('withdraw')}
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
