'use client';

import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface BudgetSelectorProps {
  budgetType: 'FIXED' | 'RANGE' | 'HOURLY';
  budgetFixed?: number;
  budgetMin?: number;
  budgetMax?: number;
  budgetHourly?: number;
  onBudgetTypeChange: (type: 'FIXED' | 'RANGE' | 'HOURLY') => void;
  onBudgetChange: (field: string, value: number | undefined) => void;
  disabled?: boolean;
}

export default function BudgetSelector({
  budgetType,
  budgetFixed,
  budgetMin,
  budgetMax,
  budgetHourly,
  onBudgetTypeChange,
  onBudgetChange,
  disabled = false,
}: BudgetSelectorProps) {
  const t = useTranslations('jobs');

  return (
    <div className="space-y-4">
      {/* Budget Type */}
      <div>
        <Label className="block mb-2">{t('budgetType')}</Label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => onBudgetTypeChange('FIXED')}
            disabled={disabled}
            className={`px-4 py-3 border rounded-md text-sm font-medium transition-colors ${
              budgetType === 'FIXED'
                ? 'border-primary bg-primary text-white'
                : 'border-gray-300 bg-white hover:bg-gray-50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {t('fixedPrice')}
          </button>
          <button
            type="button"
            onClick={() => onBudgetTypeChange('RANGE')}
            disabled={disabled}
            className={`px-4 py-3 border rounded-md text-sm font-medium transition-colors ${
              budgetType === 'RANGE'
                ? 'border-primary bg-primary text-white'
                : 'border-gray-300 bg-white hover:bg-gray-50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {t('budgetRange')}
          </button>
          <button
            type="button"
            onClick={() => onBudgetTypeChange('HOURLY')}
            disabled={disabled}
            className={`px-4 py-3 border rounded-md text-sm font-medium transition-colors ${
              budgetType === 'HOURLY'
                ? 'border-primary bg-primary text-white'
                : 'border-gray-300 bg-white hover:bg-gray-50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {t('hourlyRate')}
          </button>
        </div>
      </div>

      {/* Budget Amount Inputs */}
      {budgetType === 'FIXED' && (
        <div>
          <Label htmlFor="budgetFixed" className="block mb-2">
            {t('fixedBudget')} (USD) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="budgetFixed"
            type="number"
            min="0"
            step="0.01"
            value={budgetFixed || ''}
            onChange={(e) =>
              onBudgetChange('budgetFixed', e.target.value ? Number(e.target.value) : undefined)
            }
            disabled={disabled}
            placeholder="500.00"
            required
          />
        </div>
      )}

      {budgetType === 'RANGE' && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="budgetMin" className="block mb-2">
              {t('minBudget')} (USD) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="budgetMin"
              type="number"
              min="0"
              step="0.01"
              value={budgetMin || ''}
              onChange={(e) =>
                onBudgetChange('budgetMin', e.target.value ? Number(e.target.value) : undefined)
              }
              disabled={disabled}
              placeholder="100.00"
              required
            />
          </div>
          <div>
            <Label htmlFor="budgetMax" className="block mb-2">
              {t('maxBudget')} (USD) <span className="text-red-500">*</span>
            </Label>
            <Input
              id="budgetMax"
              type="number"
              min="0"
              step="0.01"
              value={budgetMax || ''}
              onChange={(e) =>
                onBudgetChange('budgetMax', e.target.value ? Number(e.target.value) : undefined)
              }
              disabled={disabled}
              placeholder="500.00"
              required
            />
          </div>
        </div>
      )}

      {budgetType === 'HOURLY' && (
        <div>
          <Label htmlFor="budgetHourly" className="block mb-2">
            {t('hourlyRate')} (USD/hr) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="budgetHourly"
            type="number"
            min="0"
            step="0.01"
            value={budgetHourly || ''}
            onChange={(e) =>
              onBudgetChange('budgetHourly', e.target.value ? Number(e.target.value) : undefined)
            }
            disabled={disabled}
            placeholder="25.00"
            required
          />
        </div>
      )}

      <p className="text-sm text-gray-500">{t('budgetHint')}</p>
    </div>
  );
}
