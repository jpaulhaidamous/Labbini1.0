'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useMessagesStore } from '@/lib/stores/messages.store';
import { useAuthStore } from '@/lib/stores/auth.store';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';

interface MessageThreadProps {
  threadId: string;
  locale: string;
}

export default function MessageThread({ threadId, locale }: MessageThreadProps) {
  const t = useTranslations('messages');
  const { user } = useAuthStore();
  const { currentThread, messages, isLoading, fetchThread, fetchThreadMessages, sendMessage, markAsRead } =
    useMessagesStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [typingUser, setTypingUser] = useState<string | null>(null);

  useEffect(() => {
    fetchThread(threadId);
    fetchThreadMessages(threadId);
    markAsRead(threadId);
  }, [threadId, fetchThread, fetchThreadMessages, markAsRead]);

  // Auto-scroll to newest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (content: string) => {
    try {
      await sendMessage(threadId, { content });
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  // Get other participant name
  const getThreadTitle = () => {
    if (!currentThread?.participants || currentThread.participants.length === 0) {
      return t('unknownUser');
    }
    const other = currentThread.participants[0];
    return (
      (locale === 'ar' && other.profile?.displayNameAr) ||
      other.profile?.displayNameEn ||
      other.email?.split('@')[0] ||
      'Unknown'
    );
  };

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-600">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-4 border-b bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
            <span className="text-sm text-gray-400">
              {getThreadTitle().charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="font-semibold">{getThreadTitle()}</p>
            {typingUser && (
              <p className="text-xs text-gray-500">{t('typing')}...</p>
            )}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-2">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-12">
            {t('startConversation')}
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble
              key={msg.id}
              message={msg}
              isSent={msg.senderId === user?.id}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-6 py-4 border-t bg-white">
        <MessageInput
          onSend={handleSend}
          onTypingStart={() => setTypingUser('me')}
          onTypingStop={() => setTypingUser(null)}
        />
      </div>
    </div>
  );
}
