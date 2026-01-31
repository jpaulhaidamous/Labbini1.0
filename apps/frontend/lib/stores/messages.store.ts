import { create } from 'zustand';
import { messagesApi, MessageThread, Message, CreateThreadData, SendMessageData } from '../api/messages';

interface MessagesState {
  threads: MessageThread[];
  currentThread: MessageThread | null;
  messages: Message[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchThreads: () => Promise<void>;
  fetchThread: (threadId: string) => Promise<void>;
  fetchThreadMessages: (threadId: string, page?: number, limit?: number) => Promise<void>;
  createThread: (data: CreateThreadData) => Promise<MessageThread>;
  sendMessage: (threadId: string, data: SendMessageData) => Promise<Message>;
  markAsRead: (threadId: string) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  addMessage: (message: Message) => void; // For real-time updates
  clearError: () => void;
  clearCurrentThread: () => void;
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
  threads: [],
  currentThread: null,
  messages: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchThreads: async () => {
    set({ isLoading: true, error: null });
    try {
      const threads = await messagesApi.getThreads();
      set({ threads, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch threads',
        isLoading: false,
      });
    }
  },

  fetchThread: async (threadId: string) => {
    set({ isLoading: true, error: null });
    try {
      const thread = await messagesApi.getThread(threadId);
      set({ currentThread: thread, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch thread',
        isLoading: false,
      });
    }
  },

  fetchThreadMessages: async (threadId: string, page?: number, limit?: number) => {
    set({ isLoading: true, error: null });
    try {
      const data = await messagesApi.getThreadMessages(threadId, page, limit);
      set({ messages: data.messages, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to fetch messages',
        isLoading: false,
      });
    }
  },

  createThread: async (data: CreateThreadData) => {
    set({ isLoading: true, error: null });
    try {
      const thread = await messagesApi.createThread(data);
      set((state) => ({
        threads: [thread, ...state.threads],
        currentThread: thread,
        isLoading: false,
      }));
      return thread;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to create thread',
        isLoading: false,
      });
      throw error;
    }
  },

  sendMessage: async (threadId: string, data: SendMessageData) => {
    set({ error: null });
    try {
      const message = await messagesApi.sendMessage(threadId, data);
      set((state) => ({
        messages: [...state.messages, message],
      }));
      return message;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to send message',
      });
      throw error;
    }
  },

  markAsRead: async (threadId: string) => {
    try {
      await messagesApi.markAsRead(threadId);
      // Update unread count
      await get().fetchUnreadCount();
    } catch (error: any) {
      set({
        error: error.response?.data?.message || 'Failed to mark as read',
      });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const data = await messagesApi.getUnreadCount();
      set({ unreadCount: data.unreadCount });
    } catch (error: any) {
      // Silent fail for unread count
      console.error('Failed to fetch unread count:', error);
    }
  },

  // For real-time updates from WebSocket
  addMessage: (message: Message) => {
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },

  clearError: () => set({ error: null }),
  clearCurrentThread: () => set({ currentThread: null, messages: [] }),
}));
