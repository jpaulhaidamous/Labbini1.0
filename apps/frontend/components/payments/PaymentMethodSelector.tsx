'use client';

import { useTranslations } from 'next-intl';

interface PaymentMethodSelectorProps {
  selectedMethod: string;
  onMethodChange: (method: string) => void;
}

const PAYMENT_METHODS = [
  { id: 'OMT', label: 'OMT', icon: '🏦', bg: 'bg-[#1B5E4A]/10', accent: '#1B5E4A' },
  { id: 'WHISH', label: 'Whish Money', icon: '💜', bg: 'bg-[#7C3AED]/10', accent: '#7C3AED' },
  { id: 'WALLET', label: 'Platform Wallet', icon: '💰', bg: 'bg-[#E8A945]/10', accent: '#E8A945' },
];

export default function PaymentMethodSelector({
  selectedMethod,
  onMethodChange,
}: PaymentMethodSelectorProps) {
  const t = useTranslations('payments');

  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-[#2C2C2C]">{t('paymentMethod')}</label>
      <div className="grid gap-3">
        {PAYMENT_METHODS.map((method) => {
          const isSelected = selectedMethod === method.id;
          const borderColor = isSelected
            ? method.id === 'OMT' ? 'border-[#1B5E4A]' : method.id === 'WHISH' ? 'border-[#7C3AED]' : 'border-[#E8A945]'
            : 'border-[#E5DDD3] hover:border-gray-400';
          const bgColor = isSelected
            ? method.id === 'OMT' ? 'bg-[#1B5E4A]/5' : method.id === 'WHISH' ? 'bg-[#7C3AED]/5' : 'bg-[#E8A945]/5'
            : 'bg-white';
          const labelColor = isSelected
            ? method.id === 'OMT' ? 'text-[#1B5E4A]' : method.id === 'WHISH' ? 'text-[#7C3AED]' : 'text-[#B8860B]'
            : 'text-[#2C2C2C]';

          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onMethodChange(method.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all text-left shadow-sm ${borderColor} ${bgColor}`}
            >
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl ${method.bg}`}>
                {method.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className={`font-semibold text-sm ${labelColor}`}>{method.label}</div>
                <div className="text-xs text-[#5A5A5A] mt-0.5 truncate">{t(`${method.id.toLowerCase()}Desc`)}</div>
              </div>
              {isSelected && (
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: method.accent }}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
