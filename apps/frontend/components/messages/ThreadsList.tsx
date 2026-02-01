'use client';

import { useTranslations } from 'next-intl';
import { MessageThread } from '@/lib/api/messages';
import Link from 'next/link';

interface ThreadsListProps {
  threads: MessageThread[];
  locale: string;
  currentThreadId?: string;
}

export default function ThreadsList({ threads, locale, currentThreadId }: ThreadsListProps) {
  const t = useTranslations('messages');

  const getParticipantName = (thread: MessageThread) => {
    // Show the other participant's name
    if (!thread.participants || thread.participants.length === 0) return 'Unknown';
    const other = thread.participants[0];
    return (
      (locale === 'ar' && other.profile?.displayNameAr) ||
      other.profile?.displayNameEn ||
      other.email?.split('@')[0] ||
      'Unknown'
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-lg font-bold">{t('messages')}</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        {threads.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {t('noThreads')}
          </div>
        ) : (
          threads.map((thread) => {
            const isActive = currentThreadId === thread.id;
            const participantName = getParticipantName(thread);
            const hasUnread = thread.unreadCount && thread.unreadCount > 0;

            return (
              <Link
                key={thread.id}
                href={`/${locale}/messages/${thread.id}`}
                className={`flex items-center gap-3 p-4 border-b hover:bg-gray-50 transition-colors ${
                  isActive ? 'bg-primary/5' : ''
                }`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center shrink-0">
                  <span className="text-sm text-gray-400">
                    {participantName.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`font-medium truncate ${hasUnread ? 'text-primary' : ''}`}>
                      {participantName}
                    </p>
                    {thread.lastMessageAt && (
                      <span className="text-xs text-gray-500">
                        {new Date(thread.lastMessageAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {thread.messages && thread.messages.length > 0 && (
                    <p className="text-sm text-gray-500 truncate">
                      {thread.messages[thread.messages.length - 1].content}
                    </p>
                  )}
                </div>

                {/* Unread Badge */}
                {hasUnread && (
                  <div className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                    {thread.unreadCount}
                  </div>
                )}
              </Link>
            );
          })
        )}
      </div>
    </div>
  );
}
