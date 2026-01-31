import { api } from './client';

export interface MessageThread {
  id: string;
  jobId?: string;
  contractId?: string;
  participantIds: string[];
  lastMessageAt?: string;
  createdAt: string;
  participants?: Array<{
    id: string;
    email: string;
    role: string;
    profile?: {
      displayNameEn?: string;
      displayNameAr?: string;
      avatarUrl?: string;
    };
  }>;
  messages?: Message[];
  unreadCount?: number;
}

export interface Message {
  id: string;
  threadId: string;
  senderId: string;
  content: string;
  contentType: 'TEXT' | 'FILE' | 'VOICE' | 'SYSTEM';
  attachments?: Record<string, any>;
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    email: string;
    profile?: {
      displayNameEn?: string;
      displayNameAr?: string;
      avatarUrl?: string;
    };
  };
}

export interface CreateThreadData {
  participantIds: string[];
  jobId?: string;
  contractId?: string;
}

export interface SendMessageData {
  content: string;
  contentType?: 'TEXT' | 'FILE' | 'VOICE' | 'SYSTEM';
  attachments?: Record<string, any>;
}

export const messagesApi = {
  // Create thread
  createThread: async (data: CreateThreadData) => {
    return api.post<MessageThread>('/messages/threads', data);
  },

  // Get user's threads
  getThreads: async () => {
    return api.get<MessageThread[]>('/messages/threads');
  },

  // Get thread by ID
  getThread: async (threadId: string) => {
    return api.get<MessageThread>(`/messages/threads/${threadId}`);
  },

  // Get thread messages
  getThreadMessages: async (threadId: string, page?: number, limit?: number) => {
    const params = new URLSearchParams();
    if (page) params.append('page', page.toString());
    if (limit) params.append('limit', limit.toString());
    return api.get<{
      messages: Message[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>(`/messages/threads/${threadId}/messages?${params.toString()}`);
  },

  // Send message
  sendMessage: async (threadId: string, data: SendMessageData) => {
    return api.post<Message>(`/messages/threads/${threadId}/messages`, data);
  },

  // Mark messages as read
  markAsRead: async (threadId: string) => {
    return api.patch(`/messages/threads/${threadId}/read`, {});
  },

  // Get unread count
  getUnreadCount: async () => {
    return api.get<{ unreadCount: number }>('/messages/unread-count');
  },
};
