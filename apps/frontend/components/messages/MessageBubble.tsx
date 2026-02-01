'use client';

import { useTranslations } from 'next-intl';

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    senderId: string;
    createdAt: string;
    isRead?: boolean;
  };
  isSent: boolean;
  showTimestamp?: boolean;
}

export default function MessageBubble({ message, isSent, showTimestamp = true }: MessageBubbleProps) {
  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-3`}>
      <div className={`max-w-[70%] ${isSent ? 'items-end' : 'items-start'} flex flex-col`}>
        <div
          className={`px-4 py-2 rounded-2xl ${
            isSent
              ? 'bg-primary text-white rounded-br-sm'
              : 'bg-gray-100 text-gray-800 rounded-bl-sm'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
        </div>
        {showTimestamp && (
          <div className={`flex items-center gap-1 mt-1 ${isSent ? 'flex-row-reverse' : ''}`}>
            <span className="text-xs text-gray-500">{formatTime(message.createdAt)}</span>
            {isSent && message.isRead && <span className="text-xs text-primary">✓✓</span>}
            {isSent && !message.isRead && <span className="text-xs text-gray-400">✓</span>}
          </div>
        )}
      </div>
    </div>
  );
}
