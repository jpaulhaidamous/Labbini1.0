'use client';

import { useTranslations } from 'next-intl';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface LocationSelectorProps {
  locationType: 'REMOTE' | 'ONSITE' | 'HYBRID';
  governorate?: string;
  city?: string;
  onLocationTypeChange: (type: 'REMOTE' | 'ONSITE' | 'HYBRID') => void;
  onLocationChange: (field: 'governorate' | 'city', value: string) => void;
  disabled?: boolean;
}

const GOVERNORATES = [
  'Beirut',
  'Mount Lebanon',
  'North',
  'South',
  'Beqaa',
  'Nabatieh',
  'Akkar',
  'Baalbek-Hermel',
];

export default function LocationSelector({
  locationType,
  governorate,
  city,
  onLocationTypeChange,
  onLocationChange,
  disabled = false,
}: LocationSelectorProps) {
  const t = useTranslations('jobs');

  const showLocationFields = locationType === 'ONSITE' || locationType === 'HYBRID';

  return (
    <div className="space-y-4">
      {/* Location Type */}
      <div>
        <Label className="block mb-2">{t('locationType')}</Label>
        <div className="grid grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => onLocationTypeChange('REMOTE')}
            disabled={disabled}
            className={`px-4 py-3 border rounded-md text-sm font-medium transition-colors ${
              locationType === 'REMOTE'
                ? 'border-primary bg-primary text-white'
                : 'border-gray-300 bg-white hover:bg-gray-50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {t('remote')}
          </button>
          <button
            type="button"
            onClick={() => onLocationTypeChange('ONSITE')}
            disabled={disabled}
            className={`px-4 py-3 border rounded-md text-sm font-medium transition-colors ${
              locationType === 'ONSITE'
                ? 'border-primary bg-primary text-white'
                : 'border-gray-300 bg-white hover:bg-gray-50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {t('onsite')}
          </button>
          <button
            type="button"
            onClick={() => onLocationTypeChange('HYBRID')}
            disabled={disabled}
            className={`px-4 py-3 border rounded-md text-sm font-medium transition-colors ${
              locationType === 'HYBRID'
                ? 'border-primary bg-primary text-white'
                : 'border-gray-300 bg-white hover:bg-gray-50'
            } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {t('hybrid')}
          </button>
        </div>
      </div>

      {/* Governorate and City */}
      {showLocationFields && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="governorate" className="block mb-2">
              {t('governorate')} <span className="text-red-500">*</span>
            </Label>
            <select
              id="governorate"
              value={governorate || ''}
              onChange={(e) => onLocationChange('governorate', e.target.value)}
              disabled={disabled}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              required={showLocationFields}
            >
              <option value="">{t('selectGovernorate')}</option>
              {GOVERNORATES.map((gov) => (
                <option key={gov} value={gov}>
                  {gov}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="city" className="block mb-2">
              {t('city')}
            </Label>
            <Input
              id="city"
              type="text"
              value={city || ''}
              onChange={(e) => onLocationChange('city', e.target.value)}
              disabled={disabled}
              placeholder={t('cityPlaceholder')}
            />
          </div>
        </div>
      )}

      <p className="text-sm text-gray-500">
        {locationType === 'REMOTE' && t('remoteHint')}
        {locationType === 'ONSITE' && t('onsiteHint')}
        {locationType === 'HYBRID' && t('hybridHint')}
      </p>
    </div>
  );
}
