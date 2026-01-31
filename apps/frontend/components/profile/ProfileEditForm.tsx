'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Profile, UpdateProfileData } from '@/lib/api/profiles';
import { useProfilesStore } from '@/lib/stores/profiles.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import SkillsSelector from './SkillsSelector';

interface ProfileEditFormProps {
  locale: string;
  initialProfile: Profile | null;
}

// Lebanon governorates
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

export default function ProfileEditForm({ locale, initialProfile }: ProfileEditFormProps) {
  const t = useTranslations('profile');
  const router = useRouter();
  const { updateMyProfile, isLoading, error, clearError } = useProfilesStore();

  const [formData, setFormData] = useState<UpdateProfileData>({
    displayNameEn: initialProfile?.displayNameEn || '',
    displayNameAr: initialProfile?.displayNameAr || '',
    bioEn: initialProfile?.bioEn || '',
    bioAr: initialProfile?.bioAr || '',
    avatarUrl: initialProfile?.avatarUrl || '',
    governorate: initialProfile?.governorate || '',
    city: initialProfile?.city || '',
    hourlyRate: initialProfile?.hourlyRate || undefined,
    isAvailable: initialProfile?.isAvailable ?? true,
    profileVisibility: initialProfile?.profileVisibility || 'PUBLIC',
    languages: initialProfile?.languages || [],
  });

  const [selectedSkills, setSelectedSkills] = useState(initialProfile?.skills || []);
  const [languageInput, setLanguageInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'hourlyRate' ? (value ? Number(value) : undefined) : value,
    }));
  };

  const handleAddLanguage = () => {
    if (languageInput.trim() && !formData.languages?.includes(languageInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        languages: [...(prev.languages || []), languageInput.trim()],
      }));
      setLanguageInput('');
    }
  };

  const handleRemoveLanguage = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages?.filter((l) => l !== lang) || [],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccess(false);
    clearError();

    // Validation
    if (!formData.displayNameEn || formData.displayNameEn.trim().length === 0) {
      setFormError(t('displayNameRequired'));
      return;
    }

    try {
      await updateMyProfile(formData);

      // Update skills separately if changed
      if (initialProfile && selectedSkills !== initialProfile.skills) {
        // Note: Skills update is handled separately via profilesApi.addSkills/removeSkill
        // For now, we'll just update the basic profile data
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/${locale}/profile`);
      }, 1000);
    } catch (err: any) {
      setFormError(err.response?.data?.message || t('updateFailed'));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
          {t('profileUpdated')}
        </div>
      )}

      {/* Error Message */}
      {(formError || error) && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {formError || error}
        </div>
      )}

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t('basicInformation')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Display Name (English) */}
          <div>
            <Label htmlFor="displayNameEn" className="block mb-2">
              {t('displayNameEn')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="displayNameEn"
              name="displayNameEn"
              value={formData.displayNameEn || ''}
              onChange={handleChange}
              required
              disabled={isLoading}
            />
          </div>

          {/* Display Name (Arabic) */}
          <div>
            <Label htmlFor="displayNameAr" className="block mb-2">
              {t('displayNameAr')}
            </Label>
            <Input
              id="displayNameAr"
              name="displayNameAr"
              value={formData.displayNameAr || ''}
              onChange={handleChange}
              disabled={isLoading}
              dir="rtl"
            />
          </div>

          {/* Bio (English) */}
          <div>
            <Label htmlFor="bioEn" className="block mb-2">
              {t('bioEn')}
            </Label>
            <Textarea
              id="bioEn"
              name="bioEn"
              value={formData.bioEn || ''}
              onChange={handleChange}
              rows={4}
              disabled={isLoading}
              placeholder={t('bioPlaceholder')}
            />
          </div>

          {/* Bio (Arabic) */}
          <div>
            <Label htmlFor="bioAr" className="block mb-2">
              {t('bioAr')}
            </Label>
            <Textarea
              id="bioAr"
              name="bioAr"
              value={formData.bioAr || ''}
              onChange={handleChange}
              rows={4}
              disabled={isLoading}
              dir="rtl"
              placeholder={t('bioPlaceholder')}
            />
          </div>

          {/* Avatar URL */}
          <div>
            <Label htmlFor="avatarUrl" className="block mb-2">
              {t('avatarUrl')}
            </Label>
            <Input
              id="avatarUrl"
              name="avatarUrl"
              type="url"
              value={formData.avatarUrl || ''}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="https://example.com/avatar.jpg"
            />
            <p className="text-sm text-gray-500 mt-1">{t('avatarUrlHint')}</p>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle>{t('location')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Governorate */}
          <div>
            <Label htmlFor="governorate" className="block mb-2">
              {t('governorate')}
            </Label>
            <select
              id="governorate"
              name="governorate"
              value={formData.governorate || ''}
              onChange={handleChange}
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">{t('selectGovernorate')}</option>
              {GOVERNORATES.map((gov) => (
                <option key={gov} value={gov}>
                  {gov}
                </option>
              ))}
            </select>
          </div>

          {/* City */}
          <div>
            <Label htmlFor="city" className="block mb-2">
              {t('city')}
            </Label>
            <Input
              id="city"
              name="city"
              value={formData.city || ''}
              onChange={handleChange}
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Professional Details */}
      <Card>
        <CardHeader>
          <CardTitle>{t('professionalDetails')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Hourly Rate */}
          <div>
            <Label htmlFor="hourlyRate" className="block mb-2">
              {t('hourlyRate')} (USD)
            </Label>
            <Input
              id="hourlyRate"
              name="hourlyRate"
              type="number"
              min="0"
              step="0.01"
              value={formData.hourlyRate || ''}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="50.00"
            />
          </div>

          {/* Skills */}
          <div>
            <Label className="block mb-2">{t('skills')}</Label>
            <SkillsSelector
              selectedSkills={selectedSkills}
              onSkillsChange={setSelectedSkills}
              locale={locale}
              disabled={isLoading}
            />
          </div>

          {/* Languages */}
          <div>
            <Label className="block mb-2">{t('languages')}</Label>
            <div className="space-y-2">
              {formData.languages && formData.languages.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.languages.map((lang) => (
                    <span
                      key={lang}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm"
                    >
                      {lang}
                      <button
                        type="button"
                        onClick={() => handleRemoveLanguage(lang)}
                        className="hover:text-red-600"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={languageInput}
                  onChange={(e) => setLanguageInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddLanguage();
                    }
                  }}
                  placeholder={t('addLanguage')}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  onClick={handleAddLanguage}
                  disabled={isLoading || !languageInput.trim()}
                  variant="outline"
                >
                  {t('add')}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Settings */}
      <Card>
        <CardHeader>
          <CardTitle>{t('settings')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Availability */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="isAvailable">{t('availability')}</Label>
              <p className="text-sm text-gray-500">{t('availabilityHint')}</p>
            </div>
            <Switch
              id="isAvailable"
              checked={formData.isAvailable ?? true}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({ ...prev, isAvailable: checked }))
              }
              disabled={isLoading}
            />
          </div>

          {/* Profile Visibility */}
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="profileVisibility">{t('profileVisibility')}</Label>
              <p className="text-sm text-gray-500">{t('profileVisibilityHint')}</p>
            </div>
            <select
              id="profileVisibility"
              name="profileVisibility"
              value={formData.profileVisibility || 'PUBLIC'}
              onChange={handleChange}
              disabled={isLoading}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="PUBLIC">{t('public')}</option>
              <option value="PRIVATE">{t('private')}</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? t('saving') : t('saveChanges')}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push(`/${locale}/profile`)}
          disabled={isLoading}
        >
          {t('cancel')}
        </Button>
      </div>
    </form>
  );
}
