'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Milestone } from '@/lib/api/contracts';
import { Button } from '@/components/ui/button';
import PaymentMethodSelector from '@/components/payments/PaymentMethodSelector';
import OMTInstructions from '@/components/payments/OMTInstructions';
import WhishInstructions from '@/components/payments/WhishInstructions';

interface FundMilestoneModalProps {
  milestone: Milestone;
  onFund: (paymentMethod: string, referenceNumber: string) => Promise<void>;
  onClose: () => void;
}

function generateReference(milestoneId: string): string {
  const short = milestoneId.slice(-6).toUpperCase();
  const ts = Date.now().toString(36).toUpperCase().slice(-4);
  return `LBN-${short}-${ts}`;
}

export default function FundMilestoneModal({ milestone, onFund, onClose }: FundMilestoneModalProps) {
  const t = useTranslations('payments');
  const [step, setStep] = useState<'select' | 'instructions' | 'success'>('select');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [referenceNumber, setReferenceNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const totalAmount = milestone.amount * 1.05; // 5% platform fee

  const handleConfirm = async () => {
    if (!selectedMethod) return;
    setIsProcessing(true);
    setError('');

    if (selectedMethod === 'WALLET') {
      try {
        await onFund(selectedMethod, '');
        setStep('success');
      } catch {
        setError(t('fundingFailed'));
      } finally {
        setIsProcessing(false);
      }
    } else {
      // OMT / WHISH: generate reference, show instructions, call API in background
      const ref = generateReference(milestone.id);
      setReferenceNumber(ref);
      setStep('instructions');
      onFund(selectedMethod, ref).catch(() => {
        console.error('Failed to record payment request');
      });
      setIsProcessing(false);
    }
  };

  // ─── STEP 1: Select payment method ───
  if (step === 'select') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="relative z-50 bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6 space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-bold text-[#2C2C2C]" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('fundMilestone')}</h2>
                <p className="text-[#5A5A5A] text-sm mt-0.5">{milestone.name}</p>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">×</button>
            </div>

            {/* Fee Breakdown */}
            <div className="bg-[#F5EDE3] rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#5A5A5A]">{t('milestoneAmount')}</span>
                <span className="text-[#2C2C2C]">${milestone.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#5A5A5A]">{t('platformFee')} (5%)</span>
                <span className="text-[#5A5A5A]">${(milestone.amount * 0.05).toFixed(2)}</span>
              </div>
              <div className="border-t border-[#E5DDD3] pt-2 flex justify-between">
                <span className="font-semibold text-[#2C2C2C]">{t('totalCharge')}</span>
                <span className="font-bold text-[#1B5E4A] text-lg">${totalAmount.toFixed(2)}</span>
              </div>
              <p className="text-xs text-[#5A5A5A] text-right">≈ {Math.round(totalAmount * 89500).toLocaleString()} LBP</p>
            </div>

            {/* Payment Method Selector */}
            <PaymentMethodSelector
              selectedMethod={selectedMethod}
              onMethodChange={setSelectedMethod}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-3 py-2 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleConfirm}
                disabled={!selectedMethod || isProcessing}
                className="flex-1 bg-[#1B5E4A] hover:bg-[#2D7A62] text-white font-semibold"
              >
                {isProcessing ? '...' : t('confirmAndPay')}
              </Button>
              <Button variant="outline" onClick={onClose} className="border-[#E5DDD3]">
                {t('cancel')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── STEP 2: Payment instructions (OMT or WHISH) ───
  if (step === 'instructions') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/50" />
        <div className="relative z-50 bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
          <div className="p-6 space-y-5">
            <div className="text-center">
              <h2 className="text-xl font-bold text-[#2C2C2C]" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('paymentInstructions')}</h2>
              <p className="text-[#5A5A5A] text-sm mt-0.5">{t('followStepsBelow')}</p>
            </div>

            {selectedMethod === 'OMT' && (
              <OMTInstructions amount={totalAmount} referenceNumber={referenceNumber} />
            )}
            {selectedMethod === 'WHISH' && (
              <WhishInstructions amount={totalAmount} referenceNumber={referenceNumber} />
            )}

            <Button
              onClick={onClose}
              className="w-full bg-[#1B5E4A] hover:bg-[#2D7A62] text-white font-semibold"
            >
              {t('done')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ─── STEP 3: Success (WALLET only) ───
  if (step === 'success') {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/50" />
        <div className="relative z-50 bg-white rounded-2xl shadow-xl w-full max-w-md mx-4">
          <div className="p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#1B5E4A]/10 flex items-center justify-center mx-auto">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M6 17L13 24L26 8" stroke="#1B5E4A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-[#1B5E4A]" style={{ fontFamily: 'Cairo, sans-serif' }}>{t('funded')}</h2>
            <p className="text-[#5A5A5A] text-sm">{t('walletFundedDesc')}</p>
            <p className="text-sm font-medium text-[#2C2C2C]">
              {milestone.name} — ${milestone.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </p>
            <Button onClick={onClose} className="w-full bg-[#1B5E4A] hover:bg-[#2D7A62] text-white">
              {t('done')}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
