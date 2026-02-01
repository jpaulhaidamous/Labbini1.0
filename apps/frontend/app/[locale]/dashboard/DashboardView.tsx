'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';
import { useJobsStore } from '@/lib/stores/jobs.store';
import { useProposalsStore } from '@/lib/stores/proposals.store';
import { useContractsStore } from '@/lib/stores/contracts.store';
import { useMessagesStore } from '@/lib/stores/messages.store';
import DashboardStats from '@/components/dashboard/DashboardStats';
import QuickActions from '@/components/dashboard/QuickActions';
import RecentActivity from '@/components/dashboard/RecentActivity';

interface DashboardViewProps {
  locale: string;
}

export default function DashboardView({ locale }: DashboardViewProps) {
  const t = useTranslations('dashboard');
  const { user, isReady } = useAuthGuard(locale);
  const { jobs, fetchMyJobs } = useJobsStore();
  const { myProposals, fetchMyProposals } = useProposalsStore();
  const { contracts, fetchMyContracts } = useContractsStore();
  const { threads, unreadCount, fetchThreads, fetchUnreadCount } = useMessagesStore();

  useEffect(() => {
    if (!isReady) return;
    fetchMyJobs();
    fetchMyProposals();
    fetchMyContracts();
    fetchThreads();
    fetchUnreadCount();
  }, [isReady, fetchMyJobs, fetchMyProposals, fetchMyContracts, fetchThreads, fetchUnreadCount]);

  if (!user) return null;

  const isClient = user.role === 'CLIENT';

  // Build stats based on role
  const stats = isClient
    ? [
        { label: t('jobsPosted'), value: jobs.length, icon: '📋' },
        { label: t('activeContracts'), value: contracts.filter((c) => c.status === 'ACTIVE').length, icon: '📄' },
        { label: t('totalSpent'), value: `$${contracts.reduce((sum, c) => sum + c.totalValue, 0).toLocaleString()}`, icon: '💰' },
        { label: t('messages'), value: unreadCount, icon: '💬' },
      ]
    : [
        { label: t('proposalsSubmitted'), value: myProposals.length, icon: '📝' },
        { label: t('activeContracts'), value: contracts.filter((c) => c.status === 'ACTIVE').length, icon: '📄' },
        { label: t('totalEarned'), value: user.profile ? `$${user.profile.totalEarned}` : '$0', icon: '💰' },
        { label: t('successRate'), value: user.profile ? `${user.profile.jobSuccessScore}%` : '0%', icon: '⭐' },
      ];

  // Build quick actions based on role
  const quickActions = isClient
    ? [
        { label: t('postJob'), href: `/${locale}/jobs/post`, icon: '➕', description: t('postJobDesc') },
        { label: t('myJobs'), href: `/${locale}/dashboard/jobs`, icon: '📋', description: t('myJobsDesc') },
        { label: t('myContracts'), href: `/${locale}/dashboard/contracts`, icon: '📄', description: t('myContractsDesc') },
        { label: t('messages'), href: `/${locale}/messages`, icon: '💬', description: t('messagesDesc') },
      ]
    : [
        { label: t('browseJobs'), href: `/${locale}/jobs`, icon: '🔍', description: t('browseJobsDesc') },
        { label: t('myProposals'), href: `/${locale}/dashboard/proposals`, icon: '📝', description: t('myProposalsDesc') },
        { label: t('myContracts'), href: `/${locale}/dashboard/contracts`, icon: '📄', description: t('myContractsDesc') },
        { label: t('myProfile'), href: `/${locale}/profile`, icon: '👤', description: t('myProfileDesc') },
      ];

  // Build recent activity from available data
  const activities = [
    ...jobs.slice(0, 3).map((job) => ({
      id: `job-${job.id}`,
      type: 'job',
      title: isClient ? `${t('postedJob')}: ${job.titleEn}` : `${t('newJob')}: ${job.titleEn}`,
      timestamp: job.createdAt,
      href: `/${locale}/jobs/${job.id}`,
    })),
    ...contracts.slice(0, 2).map((contract) => ({
      id: `contract-${contract.id}`,
      type: 'contract',
      title: `${t('contract')}: ${contract.job?.titleEn || t('untitled')}`,
      timestamp: contract.createdAt,
      href: `/${locale}/contracts/${contract.id}`,
    })),
    ...threads.slice(0, 2).map((thread) => ({
      id: `thread-${thread.id}`,
      type: 'message',
      title: t('newConversation'),
      timestamp: thread.createdAt,
      href: `/${locale}/messages/${thread.id}`,
    })),
  ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 6);

  return (
    <div className="space-y-6">
      <DashboardStats stats={stats} />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <QuickActions actions={quickActions} />
        </div>
        <div>
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
}
