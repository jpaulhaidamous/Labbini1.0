'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useMessagesStore } from '@/lib/stores/messages.store';
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';
import ThreadsList from '@/components/messages/ThreadsList';

interface MessagesViewProps {
  locale: string;
}

export default function MessagesView({ locale }: MessagesViewProps) {
  const t = useTranslations('messages');
  const { user, isReady } = useAuthGuard(locale);
  const { threads, isLoading, error, fetchThreads } = useMessagesStore();

  useEffect(() => {
    if (!isReady) return;
    fetchThreads();
  }, [isReady, fetchThreads]);

  if (isLoading && threads.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-600">{t('loading')}</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="flex border rounded-lg overflow-hidden" style={{ height: '600px' }}>
      {/* Threads List (Left Panel) */}
      <div className="w-80 border-r bg-white flex-shrink-0">
        <ThreadsList threads={threads} locale={locale} />
      </div>

      {/* Empty State (Right Panel) */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="text-center text-gray-500">
          <p className="text-lg">{t('selectThread')}</p>
        </div>
      </div>
    </div>
  );
}
