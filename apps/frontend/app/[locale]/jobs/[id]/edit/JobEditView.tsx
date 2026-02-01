'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useJobsStore } from '@/lib/stores/jobs.store';
import { useAuthStore } from '@/lib/stores/auth.store';
import { UpdateJobData } from '@/lib/api/jobs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import BudgetSelector from '@/components/jobs/BudgetSelector';
import LocationSelector from '@/components/jobs/LocationSelector';
import Link from 'next/link';
import { api } from '@/lib/api/client';

interface Category {
  id: string;
  nameEn: string;
  nameAr?: string;
}

interface JobEditViewProps {
  locale: string;
  jobId: string;
}

export default function JobEditView({ locale, jobId }: JobEditViewProps) {
  const t = useTranslations('jobs');
  const router = useRouter();
  const { user } = useAuthStore();
  const { currentJob, isLoading, error, fetchJob, updateJob, clearCurrentJob, clearError } =
    useJobsStore();

  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<UpdateJobData>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    fetchJob(jobId);
    const fetchCategories = async () => {
      try {
        const data = await api.get<Category[]>('/categories');
        setCategories(data);
      } catch {
        console.error('Failed to fetch categories');
      }
    };
    fetchCategories();
    return () => {
      clearCurrentJob();
    };
  }, [jobId, fetchJob, clearCurrentJob]);

  // Pre-fill form once job is loaded
  useEffect(() => {
    if (currentJob && !initialized) {
      setFormData({
        titleEn: currentJob.titleEn,
        titleAr: currentJob.titleAr,
        descriptionEn: currentJob.descriptionEn,
        descriptionAr: currentJob.descriptionAr,
        categoryId: currentJob.categoryId,
        jobType: currentJob.jobType,
        budgetType: currentJob.budgetType,
        budgetFixed: currentJob.budgetFixed,
        budgetMin: currentJob.budgetMin,
        budgetMax: currentJob.budgetMax,
        budgetHourly: currentJob.budgetHourly,
        locationType: currentJob.locationType,
        governorate: currentJob.governorate,
        city: currentJob.city,
        visibility: currentJob.visibility,
        isUrgent: currentJob.isUrgent,
      });
      setInitialized(true);
    }
  }, [currentJob, initialized]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleBudgetTypeChange = (type: 'FIXED' | 'RANGE' | 'HOURLY') => {
    setFormData((prev) => ({
      ...prev,
      budgetType: type,
      budgetFixed: undefined,
      budgetMin: undefined,
      budgetMax: undefined,
      budgetHourly: undefined,
    }));
  };

  const handleBudgetChange = (field: string, value: number | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLocationTypeChange = (type: 'REMOTE' | 'ONSITE' | 'HYBRID') => {
    setFormData((prev) => ({
      ...prev,
      locationType: type,
      governorate: type === 'REMOTE' ? undefined : prev.governorate,
      city: type === 'REMOTE' ? undefined : prev.city,
    }));
  };

  const handleLocationChange = (field: 'governorate' | 'city', value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.titleEn?.trim()) {
      setFormError(t('titleRequired'));
      return;
    }
    if (!formData.descriptionEn?.trim()) {
      setFormError(t('descriptionRequired'));
      return;
    }

    setIsSaving(true);
    setFormError(null);
    clearError();

    try {
      await updateJob(jobId, formData);
      router.push(`/${locale}/jobs/${jobId}`);
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  // Auth guard: only the job owner can edit
  if (user && currentJob && user.id !== currentJob.clientId) {
    router.push(`/${locale}/jobs/${jobId}`);
    return null;
  }

  if (isLoading && !initialized) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-[#5A5A5A]">{t('loadingJob')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {error}
        </div>
        <Link href={`/${locale}/jobs`}>
          <Button>{t('backToJobs')}</Button>
        </Link>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="space-y-4">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
          {t('jobNotFound')}
        </div>
        <Link href={`/${locale}/jobs`}>
          <Button>{t('backToJobs')}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <Link href={`/${locale}/jobs/${jobId}`} className="text-[#1B5E4A] hover:underline">
          ← {t('backToJobs')}
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-[#2C2C2C]" style={{ fontFamily: 'Cairo, sans-serif' }}>
        {t('editJob')}
      </h1>

      {(formError || error) && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {formError || error}
        </div>
      )}

      {/* Basics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#1B5E4A]" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {t('stepBasics')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="titleEn" className="block mb-2">
              {t('jobTitleEn')} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="titleEn"
              name="titleEn"
              value={formData.titleEn || ''}
              onChange={handleChange}
              placeholder={t('jobTitlePlaceholder')}
            />
          </div>

          <div>
            <Label htmlFor="titleAr" className="block mb-2">
              {t('jobTitleAr')}
            </Label>
            <Input
              id="titleAr"
              name="titleAr"
              value={formData.titleAr || ''}
              onChange={handleChange}
              dir="rtl"
              placeholder={t('jobTitlePlaceholder')}
            />
          </div>

          <div>
            <Label htmlFor="descriptionEn" className="block mb-2">
              {t('jobDescriptionEn')} <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="descriptionEn"
              name="descriptionEn"
              value={formData.descriptionEn || ''}
              onChange={handleChange}
              rows={6}
              placeholder={t('jobDescriptionPlaceholder')}
            />
          </div>

          <div>
            <Label htmlFor="descriptionAr" className="block mb-2">
              {t('jobDescriptionAr')}
            </Label>
            <Textarea
              id="descriptionAr"
              name="descriptionAr"
              value={formData.descriptionAr || ''}
              onChange={handleChange}
              rows={6}
              dir="rtl"
              placeholder={t('jobDescriptionPlaceholder')}
            />
          </div>

          <div>
            <Label htmlFor="categoryId" className="block mb-2">
              {t('category')} <span className="text-red-500">*</span>
            </Label>
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">{t('selectCategory')}</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {locale === 'ar' && cat.nameAr ? cat.nameAr : cat.nameEn}
                </option>
              ))}
            </select>
          </div>

          <div>
            <Label htmlFor="jobType" className="block mb-2">
              {t('jobType')}
            </Label>
            <select
              id="jobType"
              name="jobType"
              value={formData.jobType || 'FIXED'}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="FIXED">{t('fixedPriceJob')}</option>
              <option value="HOURLY">{t('hourlyJob')}</option>
              <option value="QUICK">{t('quickTask')}</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Budget */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#1B5E4A]" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {t('stepBudget')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BudgetSelector
            budgetType={formData.budgetType || 'FIXED'}
            budgetFixed={formData.budgetFixed}
            budgetMin={formData.budgetMin}
            budgetMax={formData.budgetMax}
            budgetHourly={formData.budgetHourly}
            onBudgetTypeChange={handleBudgetTypeChange}
            onBudgetChange={handleBudgetChange}
          />
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[#1B5E4A]" style={{ fontFamily: 'Cairo, sans-serif' }}>
            {t('stepLocation')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <LocationSelector
            locationType={formData.locationType || 'REMOTE'}
            governorate={formData.governorate}
            city={formData.city}
            onLocationTypeChange={handleLocationTypeChange}
            onLocationChange={handleLocationChange}
          />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between">
        <Link href={`/${locale}/jobs/${jobId}`}>
          <Button variant="outline">{t('cancel')}</Button>
        </Link>
        <Button
          className="bg-[#1B5E4A] hover:bg-[#2D7A62] text-white"
          disabled={isSaving}
          onClick={handleSave}
        >
          {isSaving ? '...' : t('saveJob')}
        </Button>
      </div>
    </div>
  );
}
