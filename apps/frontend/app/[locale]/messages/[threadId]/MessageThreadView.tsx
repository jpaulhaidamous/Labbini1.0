'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMessagesStore } from '@/lib/stores/messages.store';
import { useAuthGuard } from '@/lib/hooks/useAuthGuard';
import ThreadsList from '@/components/messages/ThreadsList';
import MessageThread from '@/components/messages/MessageThread';

interface MessageThreadViewProps {
  locale: string;
  threadId: string;
}

export default function MessageThreadView({ locale, threadId }: MessageThreadViewProps) {
  const router = useRouter();
  const { user, isReady } = useAuthGuard(locale);
  const { threads, fetchThreads } = useMessagesStore();

  useEffect(() => {
    if (!isReady) return;
    fetchThreads();
  }, [isReady, fetchThreads]);

  return (
    <>
      {/* Threads List (Left Panel) */}
      <div className="w-80 border-r bg-white flex-shrink-0">
        <ThreadsList threads={threads} locale={locale} currentThreadId={threadId} />
      </div>

      {/* Active Thread (Right Panel) */}
      <div className="flex-1 bg-white">
        <MessageThread threadId={threadId} locale={locale} />
      </div>
    </>
  );
}
