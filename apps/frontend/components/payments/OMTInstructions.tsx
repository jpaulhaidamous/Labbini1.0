'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';

const USD_TO_LBP = 89500;

interface OMTInstructionsProps {
  amount: number;
  referenceNumber: string;
}

export default function OMTInstructions({ amount, referenceNumber }: OMTInstructionsProps) {
  const t = useTranslations('payments');
  const [copied, setCopied] = useState(false);
  const lbpAmount = Math.round(amount * USD_TO_LBP);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referenceNumber).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-4">
      {/* Reference Number — prominent green card */}
      <div className="bg-[#1B5E4A] rounded-xl p-5 text-center">
        <p className="text-white/60 text-xs font-medium uppercase tracking-wider mb-2">{t('paymentReference')}</p>
        <div className="flex items-center justify-center gap-2">
          <p className="text-white text-2xl font-bold tracking-widest" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {referenceNumber}
          </p>
          <button
            onClick={copyToClipboard}
            className="text-white/50 hover:text-white transition-colors ml-1"
            title={t('copy')}
          >
            {copied ? (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <rect x="1" y="4" width="9" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
                <rect x="6" y="1" width="9" height="10" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Amount — dual currency */}
      <div className="bg-[#F5EDE3] rounded-lg p-4 space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#5A5A5A] font-medium">{t('amountUSD')}</span>
          <span className="font-bold text-[#1B5E4A]">${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-[#5A5A5A] font-medium">{t('amountLBP')}</span>
          <span className="font-semibold text-[#5A5A5A]">{lbpAmount.toLocaleString()} LBP</span>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-3">
        {[
          t('omtStep1'),
          t('omtStep2'),
          t('omtStep3'),
          t('omtStep4'),
        ].map((text, i) => (
          <div key={i} className="flex gap-3">
            <div className="w-6 h-6 rounded-full bg-[#1B5E4A] text-white flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
              {i + 1}
            </div>
            <p className="text-sm text-[#5A5A5A] leading-relaxed">{text}</p>
          </div>
        ))}
      </div>

      {/* Recipient info */}
      <div className="border border-[#E5DDD3] rounded-lg p-3 space-y-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-[#5A5A5A]">{t('recipient')}</span>
          <span className="font-medium text-[#2C2C2C]">{t('labbiniEscrow')}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-[#5A5A5A]">{t('phone')}</span>
          <span className="font-medium text-[#2C2C2C]">+961 XX XXX XXX</span>
        </div>
      </div>
    </div>
  );
}
