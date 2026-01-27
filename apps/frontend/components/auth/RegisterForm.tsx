'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/stores/auth.store';

export default function RegisterForm({ locale }: { locale: string }) {
  const t = useTranslations('auth');
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuthStore();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'FREELANCER' as 'CLIENT' | 'FREELANCER',
    displayNameEn: '',
    displayNameAr: '',
  });

  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    clearError();

    // Validation
    if (!formData.email || !formData.password || !formData.phone || !formData.displayNameEn) {
      setFormError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setFormError('Password must be at least 8 characters');
      return;
    }

    // Validate Lebanese phone format
    const phoneRegex = /^\+961[0-9]{8}$/;
    if (!phoneRegex.test(formData.phone)) {
      setFormError('Phone must be in Lebanese format: +961XXXXXXXX');
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        role: formData.role,
        displayNameEn: formData.displayNameEn,
        displayNameAr: formData.displayNameAr || undefined,
      });

      // Success! Redirect to home
      router.push(`/${locale}`);
      router.refresh();
    } catch (err: any) {
      setFormError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {(formError || error) && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
          {formError || error}
        </div>
      )}

      <div>
        <label htmlFor="role" className="block text-sm font-medium mb-2">
          I want to *
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
          disabled={isLoading}
        >
          <option value="FREELANCER">Offer Services (Freelancer)</option>
          <option value="CLIENT">Hire Freelancers (Client)</option>
        </select>
      </div>

      <div>
        <label htmlFor="displayNameEn" className="block text-sm font-medium mb-2">
          Full Name (English) *
        </label>
        <input
          id="displayNameEn"
          name="displayNameEn"
          type="text"
          value={formData.displayNameEn}
          onChange={handleChange}
          placeholder="John Doe"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="displayNameAr" className="block text-sm font-medium mb-2">
          Full Name (Arabic) - Optional
        </label>
        <input
          id="displayNameAr"
          name="displayNameAr"
          type="text"
          value={formData.displayNameAr}
          onChange={handleChange}
          placeholder="جون دو"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          dir="rtl"
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-2">
          {t('email')} *
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-2">
          Phone (Lebanese: +961XXXXXXXX) *
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleChange}
          placeholder="+96170123456"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
          disabled={isLoading}
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-2">
          {t('password')} *
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
          minLength={8}
          disabled={isLoading}
        />
        <p className="text-xs text-gray-500 mt-1">Minimum 8 characters</p>
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
          Confirm Password *
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="••••••••"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          required
          disabled={isLoading}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Creating account...' : t('signUp')}
      </Button>
    </form>
  );
}
