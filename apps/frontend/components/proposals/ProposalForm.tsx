'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useProposalsStore } from '@/lib/stores/proposals.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

interface ProposalFormProps {
  jobId: string;
  jobTitle: string;
  locale: string;
}

export default function ProposalForm({ jobId, jobTitle, locale }: ProposalFormProps) {
  const t = useTranslations('proposals');
  const router = useRouter();
  const { createProposal, isLoading, error, clearError } = useProposalsStore();

  const [formData, setFormData] = useState({
    coverLetterEn: '',
    coverLetterAr: '',
    proposedRate: '',
    proposedDuration: '',
    durationUnit: 'DAYS' as 'HOURS' | 'DAYS' | 'WEEKS' | 'MONTHS',
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    // Validation
    if (!formData.coverLetterEn.trim()) {
      setFormError(t('coverLetterRequired'));
      return;
    }
    if (!formData.proposedRate || Number(formData.proposedRate) <= 0) {
      setFormError(t('proposedRateRequired'));
      return;
    }
    if (!formData.proposedDuration || Number(formData.proposedDuration) <= 0) {
      setFormError(t('durationRequired'));
      return;
    }

    try {
      await createProposal({
        jobId,
        coverLetterEn: formData.coverLetterEn,
        coverLetterAr: formData.coverLetterAr || undefined,
        proposedRate: Number(formData.proposedRate),
        proposedDuration: Number(formData.proposedDuration),
        durationUnit: formData.durationUnit,
      });

      setSubmitted(true);
      setTimeout(() => {
        router.push(`/${locale}/dashboard/proposals`);
      }, 1500);
    } catch (err: any) {
      setFormError(err.response?.data?.message || t('submitFailed'));
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <div className="text-green-600 text-xl font-semibold mb-2">{t('proposalSubmitted')}</div>
        <p className="text-gray-600">{t('redirecting')}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Job Reference */}
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-gray-600">
            {t('proposalFor')}: <span className="font-semibold">{jobTitle}</span>
          </p>
        </CardContent>
      </Card>

      {/* Error */}
      {(formError || error) && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {formError || error}
        </div>
      )}

      {/* Cover Letter */}
      <Card>
        <CardHeader>
          <CardTitle>{t('coverLetter')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="coverLetterEn" className="block mb-2">
              {t('coverLetterEn')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="coverLetterEn"
              name="coverLetterEn"
              value={formData.coverLetterEn}
              onChange={handleChange}
              rows={6}
              placeholder={t('coverLetterPlaceholder')}
              disabled={isLoading}
              required
            />
          </div>

          <div>
            <Label htmlFor="coverLetterAr" className="block mb-2">
              {t('coverLetterAr')}
            </Label>
            <Textarea
              id="coverLetterAr"
              name="coverLetterAr"
              value={formData.coverLetterAr}
              onChange={handleChange}
              rows={6}
              dir="rtl"
              placeholder={t('coverLetterPlaceholder')}
              disabled={isLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* Rate and Duration */}
      <Card>
        <CardHeader>
          <CardTitle>{t('proposalDetails')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Proposed Rate */}
            <div>
              <Label htmlFor="proposedRate" className="block mb-2">
                {t('proposedRate')} (USD) <span className="text-red-500">*</span>
              </Label>
              <Input
                id="proposedRate"
                name="proposedRate"
                type="number"
                min="0"
                step="0.01"
                value={formData.proposedRate}
                onChange={handleChange}
                placeholder="500.00"
                disabled={isLoading}
                required
              />
            </div>

            {/* Duration */}
            <div>
              <Label className="block mb-2">
                {t('estimatedDuration')} <span className="text-red-500">*</span>
              </Label>
              <div className="flex gap-2">
                <Input
                  id="proposedDuration"
                  name="proposedDuration"
                  type="number"
                  min="1"
                  value={formData.proposedDuration}
                  onChange={handleChange}
                  placeholder="5"
                  disabled={isLoading}
                  className="flex-1"
                  required
                />
                <select
                  name="durationUnit"
                  value={formData.durationUnit}
                  onChange={handleChange}
                  disabled={isLoading}
                  className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="HOURS">{t('hours')}</option>
                  <option value="DAYS">{t('days')}</option>
                  <option value="WEEKS">{t('weeks')}</option>
                  <option value="MONTHS">{t('months')}</option>
                </select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading} className="flex-1">
          {isLoading ? t('submitting') : t('submitProposal')}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isLoading}
        >
          {t('cancel')}
        </Button>
      </div>
    </form>
  );
}
