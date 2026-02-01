'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Header } from '@/components/layout/Header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { api } from '@/lib/api/client';

interface Job {
  id: string;
  titleEn?: string;
  titleAr?: string;
  descriptionEn?: string;
  descriptionAr?: string;
  jobType?: string;
  budgetType?: string;
  budgetMin?: number;
  budgetMax?: number;
  budgetFixed?: number;
  locationType?: string;
  governorate?: string;
  city?: string;
  createdAt?: string;
  category?: {
    nameEn?: string;
    nameAr?: string;
  } | null;
  client?: {
    profile?: {
      displayNameEn?: string;
      displayNameAr?: string;
    } | null;
  } | null;
}

function safeLower(s: unknown) {
  return typeof s === 'string' ? s.toLowerCase() : '';
}

export default function JobsPage() {
  const t = useTranslations('jobs');
  const tCommon = useTranslations('common');
  const params = useParams();
  const locale = params?.locale as string || 'en';
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    void loadJobs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Support both: api.get() returns data directly OR wraps inside { data: ... }
      const res: any = await api.get('/jobs');
      const payload = res?.data ?? res;

      const list = Array.isArray(payload?.jobs) ? payload.jobs : [];
      setJobs(list);
    } catch (err: any) {
      setError(err?.response?.data?.message || tCommon('error'));
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = useMemo(() => {
    const q = safeLower(searchQuery);

    if (!q) return jobs;

    return jobs.filter((job) => {
      const title = safeLower(job.titleEn);
      const desc = safeLower(job.descriptionEn);
      const cat = safeLower(job.category?.nameEn);

      return title.includes(q) || desc.includes(q) || cat.includes(q);
    });
  }, [jobs, searchQuery]);

  return (
    <div className="min-h-screen bg-[#FDF8F3]">
      <Header />

      <div className="container mx-auto px-4 py-12">
        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1
            className="text-5xl font-bold text-[#2C2C2C] mb-4"
            style={{ fontFamily: 'Cairo, sans-serif' }}
          >
            {t('pageTitle')}
          </h1>
          <p className="text-xl text-[#5A5A5A] max-w-2xl mx-auto">
            {t('pageDescription')}
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <Input
            type="text"
            placeholder={t('searchPlaceholder')}
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchQuery(e.target.value)
            }
            className="h-14 text-lg border-[#F5EDE3] focus:border-[#1B5E4A]"
          />
        </div>

        {/* Error State */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded text-center">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-[#1B5E4A] border-r-transparent" />
            <p className="mt-4 text-[#5A5A5A]">{t('loadingJobs')}</p>
          </div>
        )}

        {/* Jobs Grid */}
        {!loading && (
          <div className="grid gap-6">
            {filteredJobs.length === 0 ? (
              <Card className="text-center py-20 bg-white shadow-md">
                <CardHeader>
                  <CardTitle className="text-2xl text-[#5A5A5A]">
                    {searchQuery ? t('noJobsFound') : t('noJobsAvailable')}
                  </CardTitle>
                  <CardDescription>
                    {searchQuery ? t('tryAdjusting') : t('checkBackSoon')}
                  </CardDescription>
                </CardHeader>
              </Card>
            ) : (
              filteredJobs.map((job) => {
                const title = job.titleEn ?? 'Untitled job';
                const poster =
                  job.client?.profile?.displayNameEn ?? 'Unknown client';
                const category = job.category?.nameEn ?? 'Uncategorized';

                const created =
                  job.createdAt && !Number.isNaN(Date.parse(job.createdAt))
                    ? new Date(job.createdAt).toLocaleDateString()
                    : '—';

                const governorate = job.governorate ?? '—';

                const locationLabel =
                  job.locationType === 'REMOTE'
                    ? t('remote')
                    : job.locationType === 'ONSITE'
                      ? t('onsite')
                      : job.locationType === 'HYBRID'
                        ? t('hybrid')
                        : '—';

                const isFixed =
                  job.budgetType === 'FIXED' && typeof job.budgetFixed === 'number';
                const isRange =
                  job.budgetType === 'RANGE' &&
                  typeof job.budgetMin === 'number' &&
                  typeof job.budgetMax === 'number';

                const jobTypeLabel =
                  job.jobType === 'FIXED'
                    ? t('fixedPrice')
                    : job.jobType === 'HOURLY'
                      ? t('hourly')
                      : '—';

                const desc = job.descriptionEn ?? '';

                return (
                  <Card
                    key={job.id}
                    className="bg-white shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-[#E8A945]"
                  >
                    <CardHeader>
                      <div className="flex justify-between items-start gap-6">
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-2xl text-[#1B5E4A] mb-2">
                            {title}
                          </CardTitle>
                          <CardDescription className="text-base">
                            {tCommon('postedBy')}{' '}
                            <span className="font-semibold text-[#2C2C2C]">
                              {poster}
                            </span>
                            {' • '}
                            <span className="text-[#E8A945] font-semibold">
                              {category}
                            </span>
                          </CardDescription>
                        </div>

                        <div className="text-right shrink-0">
                          {isFixed && (
                            <div className="text-2xl font-bold text-[#1B5E4A]">
                              ${job.budgetFixed}
                            </div>
                          )}
                          {isRange && (
                            <div className="text-2xl font-bold text-[#1B5E4A]">
                              ${job.budgetMin} - ${job.budgetMax}
                            </div>
                          )}
                          {!isFixed && !isRange && (
                            <div className="text-2xl font-bold text-[#1B5E4A]">
                              —
                            </div>
                          )}

                          <div className="text-sm text-[#5A5A5A] mt-1">
                            {jobTypeLabel}
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <p className="text-[#5A5A5A] mb-4 line-clamp-3">
                        {desc || t('noDescription')}
                      </p>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-wrap gap-4 text-sm text-[#5A5A5A]">
                          <span>📍 {governorate}</span>
                          <span>🏠 {locationLabel}</span>
                          <span>⏰ {created}</span>
                        </div>

                        <Link href={`/${locale}/jobs/${job.id}`}>
                          <Button className="bg-[#1B5E4A] hover:bg-[#2D7A62] text-white">
                            {tCommon('viewDetails')}
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        )}

        {/* Stats Section */}
        {!loading && jobs.length > 0 && (
          <div className="mt-12 text-center text-[#5A5A5A]">
            <p className="text-lg">
              {tCommon('showing')}{' '}
              <span className="font-bold text-[#1B5E4A]">
                {filteredJobs.length}
              </span>{' '}
              {tCommon('of')}{' '}
              <span className="font-bold text-[#1B5E4A]">{jobs.length}</span>{' '}
              {tCommon('jobs')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
