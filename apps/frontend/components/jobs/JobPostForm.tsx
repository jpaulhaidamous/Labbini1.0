'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { CreateJobData } from '@/lib/api/jobs';
import { useJobsStore } from '@/lib/stores/jobs.store';
import { useAuthStore } from '@/lib/stores/auth.store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import BudgetSelector from './BudgetSelector';
import LocationSelector from './LocationSelector';
import { api } from '@/lib/api/client';

interface JobPostFormProps {
  locale: string;
}

interface Category {
  id: string;
  nameEn: string;
  nameAr?: string;
}

type FormStep = 'basics' | 'budget' | 'location' | 'review';

export default function JobPostForm({ locale }: JobPostFormProps) {
  const t = useTranslations('jobs');
  const router = useRouter();
  const { user } = useAuthStore();
  const { createJob, isLoading, error, clearError } = useJobsStore();

  const [currentStep, setCurrentStep] = useState<FormStep>('basics');
  const [categories, setCategories] = useState<Category[]>([]);
  const [formError, setFormError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateJobData>({
    titleEn: '',
    titleAr: '',
    descriptionEn: '',
    descriptionAr: '',
    categoryId: '',
    jobType: 'FIXED',
    budgetType: 'FIXED',
    locationType: 'REMOTE',
    visibility: 'PUBLIC',
    isUrgent: false,
  });

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await api.get<Category[]>('/categories');
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };
    fetchCategories();
  }, []);

  // Check if user is a client
  useEffect(() => {
    if (user && user.role !== 'CLIENT') {
      router.push(`/${locale}/jobs`);
    }
  }, [user, locale, router]);

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

  const validateStep = (step: FormStep): boolean => {
    setFormError(null);

    switch (step) {
      case 'basics':
        if (!formData.titleEn || formData.titleEn.trim().length === 0) {
          setFormError(t('titleRequired'));
          return false;
        }
        if (!formData.descriptionEn || formData.descriptionEn.trim().length === 0) {
          setFormError(t('descriptionRequired'));
          return false;
        }
        if (!formData.categoryId) {
          setFormError(t('categoryRequired'));
          return false;
        }
        break;

      case 'budget':
        if (formData.budgetType === 'FIXED' && !formData.budgetFixed) {
          setFormError(t('budgetRequired'));
          return false;
        }
        if (formData.budgetType === 'RANGE' && (!formData.budgetMin || !formData.budgetMax)) {
          setFormError(t('budgetRangeRequired'));
          return false;
        }
        if (
          formData.budgetType === 'RANGE' &&
          formData.budgetMin &&
          formData.budgetMax &&
          formData.budgetMin >= formData.budgetMax
        ) {
          setFormError(t('invalidBudgetRange'));
          return false;
        }
        if (formData.budgetType === 'HOURLY' && !formData.budgetHourly) {
          setFormError(t('hourlyRateRequired'));
          return false;
        }
        break;

      case 'location':
        if (
          (formData.locationType === 'ONSITE' || formData.locationType === 'HYBRID') &&
          !formData.governorate
        ) {
          setFormError(t('governorateRequired'));
          return false;
        }
        break;
    }

    return true;
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) return;

    const steps: FormStep[] = ['basics', 'budget', 'location', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  };

  const handleBack = () => {
    const steps: FormStep[] = ['basics', 'budget', 'location', 'review'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  };

  const handleSaveDraft = async () => {
    setFormError(null);
    clearError();

    try {
      const job = await createJob({ ...formData, status: 'DRAFT' } as any);
      router.push(`/${locale}/dashboard/jobs`);
    } catch (err: any) {
      setFormError(err.response?.data?.message || t('saveDraftFailed'));
    }
  };

  const handleSubmit = async () => {
    if (!validateStep('review')) return;

    setFormError(null);
    clearError();

    try {
      const job = await createJob(formData);
      router.push(`/${locale}/jobs/${job.id}`);
    } catch (err: any) {
      setFormError(err.response?.data?.message || t('postJobFailed'));
    }
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find((c) => c.id === categoryId);
    if (!category) return '';
    return locale === 'ar' && category.nameAr ? category.nameAr : category.nameEn;
  };

  const steps: FormStep[] = ['basics', 'budget', 'location', 'review'];
  const currentStepIndex = steps.indexOf(currentStep);

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center flex-1">
            <div
              className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                index <= currentStepIndex
                  ? 'border-primary bg-primary text-white'
                  : 'border-gray-300 bg-white text-gray-400'
              }`}
            >
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`flex-1 h-1 mx-2 ${
                  index < currentStepIndex ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Labels */}
      <div className="flex justify-between text-sm">
        <span className={currentStep === 'basics' ? 'font-semibold text-primary' : 'text-gray-600'}>
          {t('stepBasics')}
        </span>
        <span className={currentStep === 'budget' ? 'font-semibold text-primary' : 'text-gray-600'}>
          {t('stepBudget')}
        </span>
        <span
          className={currentStep === 'location' ? 'font-semibold text-primary' : 'text-gray-600'}
        >
          {t('stepLocation')}
        </span>
        <span className={currentStep === 'review' ? 'font-semibold text-primary' : 'text-gray-600'}>
          {t('stepReview')}
        </span>
      </div>

      {/* Error Message */}
      {(formError || error) && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
          {formError || error}
        </div>
      )}

      {/* Form Content */}
      <Card>
        <CardHeader>
          <CardTitle>
            {currentStep === 'basics' && t('stepBasics')}
            {currentStep === 'budget' && t('stepBudget')}
            {currentStep === 'location' && t('stepLocation')}
            {currentStep === 'review' && t('stepReview')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Step 1: Basics */}
          {currentStep === 'basics' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="titleEn" className="block mb-2">
                  {t('jobTitleEn')} <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="titleEn"
                  name="titleEn"
                  value={formData.titleEn}
                  onChange={handleChange}
                  placeholder={t('jobTitlePlaceholder')}
                  required
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
                  value={formData.descriptionEn}
                  onChange={handleChange}
                  rows={6}
                  placeholder={t('jobDescriptionPlaceholder')}
                  required
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
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  required
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
                  {t('jobType')} <span className="text-red-500">*</span>
                </Label>
                <select
                  id="jobType"
                  name="jobType"
                  value={formData.jobType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="FIXED">{t('fixedPriceJob')}</option>
                  <option value="HOURLY">{t('hourlyJob')}</option>
                  <option value="QUICK">{t('quickTask')}</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 2: Budget */}
          {currentStep === 'budget' && (
            <BudgetSelector
              budgetType={formData.budgetType}
              budgetFixed={formData.budgetFixed}
              budgetMin={formData.budgetMin}
              budgetMax={formData.budgetMax}
              budgetHourly={formData.budgetHourly}
              onBudgetTypeChange={handleBudgetTypeChange}
              onBudgetChange={handleBudgetChange}
            />
          )}

          {/* Step 3: Location */}
          {currentStep === 'location' && (
            <LocationSelector
              locationType={formData.locationType}
              governorate={formData.governorate}
              city={formData.city}
              onLocationTypeChange={handleLocationTypeChange}
              onLocationChange={handleLocationChange}
            />
          )}

          {/* Step 4: Review */}
          {currentStep === 'review' && (
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">{t('reviewJobDetails')}</h3>
                <p className="text-sm text-gray-600">{t('reviewJobHint')}</p>
              </div>

              <div className="space-y-4 border-t pt-4">
                <div>
                  <span className="font-medium">{t('jobTitle')}:</span>
                  <p className="text-gray-700">{formData.titleEn}</p>
                  {formData.titleAr && <p className="text-gray-700" dir="rtl">{formData.titleAr}</p>}
                </div>

                <div>
                  <span className="font-medium">{t('category')}:</span>
                  <p className="text-gray-700">{getCategoryName(formData.categoryId)}</p>
                </div>

                <div>
                  <span className="font-medium">{t('jobType')}:</span>
                  <p className="text-gray-700">
                    {formData.jobType === 'FIXED' && t('fixedPriceJob')}
                    {formData.jobType === 'HOURLY' && t('hourlyJob')}
                    {formData.jobType === 'QUICK' && t('quickTask')}
                  </p>
                </div>

                <div>
                  <span className="font-medium">{t('budget')}:</span>
                  <p className="text-gray-700">
                    {formData.budgetType === 'FIXED' && `$${formData.budgetFixed}`}
                    {formData.budgetType === 'RANGE' &&
                      `$${formData.budgetMin} - $${formData.budgetMax}`}
                    {formData.budgetType === 'HOURLY' && `$${formData.budgetHourly}/hr`}
                  </p>
                </div>

                <div>
                  <span className="font-medium">{t('locationType')}:</span>
                  <p className="text-gray-700">
                    {formData.locationType === 'REMOTE' && t('remote')}
                    {formData.locationType === 'ONSITE' && t('onsite')}
                    {formData.locationType === 'HYBRID' && t('hybrid')}
                    {formData.governorate && ` - ${formData.governorate}`}
                    {formData.city && `, ${formData.city}`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between">
        <div className="flex gap-2">
          {currentStepIndex > 0 && (
            <Button type="button" variant="outline" onClick={handleBack} disabled={isLoading}>
              {t('back')}
            </Button>
          )}
          <Button type="button" variant="ghost" onClick={handleSaveDraft} disabled={isLoading}>
            {t('saveDraft')}
          </Button>
        </div>

        <div>
          {currentStep !== 'review' ? (
            <Button type="button" onClick={handleNext} disabled={isLoading}>
              {t('next')}
            </Button>
          ) : (
            <Button type="button" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? t('posting') : t('postJob')}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
