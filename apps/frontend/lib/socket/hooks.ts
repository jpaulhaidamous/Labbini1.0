'use client';

import { useEffect, useState, useCallback } from 'react';
import { socketClient } from './client';
import { Message } from '../api/messages';
import { useMessagesStore } from '../stores/messages.store';

/**
 * Hook to manage Socket.io connection
 */
export function useSocket(token?: string | null) {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    if (!token) {
      socketClient.disconnect();
      setIsConnected(false);
      return;
    }

    setIsConnecting(true);

    try {
      const socket = socketClient.connect(token);

      socket.on('connect', () => {
        setIsConnected(true);
        setIsConnecting(false);
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      socket.on('connect_error', () => {
        setIsConnecting(false);
      });

      return () => {
        socketClient.disconnect();
        setIsConnected(false);
      };
    } catch (error) {
      console.error('Socket connection error:', error);
      setIsConnecting(false);
    }
  }, [token]);

  return { isConnected, isConnecting };
}

/**
 * Hook to listen for messages in a thread
 */
export function useMessageListener(threadId: string | null) {
  const addMessage = useMessagesStore((state) => state.addMessage);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!threadId || !socketClient.isConnected()) return;

    // Join the thread
    socketClient.joinThread(threadId);

    // Listen for new messages
    const handleMessageReceived = (data: { message: Message; threadId: string }) => {
      if (data.threadId === threadId) {
        addMessage(data.message);
        // Mark as read automatically
        socketClient.markAsRead(threadId);
      }
    };

    // Listen for typing indicators
    const handleTyping = (data: { userId: string; threadId: string; isTyping: boolean }) => {
      if (data.threadId === threadId) {
        setTypingUsers((prev) => {
          const newSet = new Set(prev);
          if (data.isTyping) {
            newSet.add(data.userId);
          } else {
            newSet.delete(data.userId);
          }
          return newSet;
        });
      }
    };

    socketClient.onMessageReceived(handleMessageReceived);
    socketClient.onUserTyping(handleTyping);

    return () => {
      socketClient.off('message_received', handleMessageReceived);
      socketClient.off('user_typing', handleTyping);
      socketClient.leaveThread(threadId);
    };
  }, [threadId, addMessage]);

  return { typingUsers: Array.from(typingUsers) };
}

/**
 * Hook to send messages with typing indicators
 */
export function useMessageSender(threadId: string | null) {
  const [isSending, setIsSending] = useState(false);
  const sendMessageFromStore = useMessagesStore((state) => state.sendMessage);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!threadId || !content.trim()) return;

      setIsSending(true);
      try {
        await sendMessageFromStore(threadId, { content: content.trim() });
        socketClient.stopTyping(threadId);
      } catch (error) {
        console.error('Failed to send message:', error);
        throw error;
      } finally {
        setIsSending(false);
      }
    },
    [threadId, sendMessageFromStore]
  );

  const startTyping = useCallback(() => {
    if (threadId) {
      socketClient.startTyping(threadId);
    }
  }, [threadId]);

  const stopTyping = useCallback(() => {
    if (threadId) {
      socketClient.stopTyping(threadId);
    }
  }, [threadId]);

  return {
    sendMessage,
    startTyping,
    stopTyping,
    isSending,
  };
}

/**
 * Hook to track online users
 */
export function useOnlineStatus() {
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!socketClient.isConnected()) return;

    const handleUserOnline = (data: { userId: string }) => {
      setOnlineUsers((prev) => new Set(prev).add(data.userId));
    };

    const handleUserOffline = (data: { userId: string }) => {
      setOnlineUsers((prev) => {
        const newSet = new Set(prev);
        newSet.delete(data.userId);
        return newSet;
      });
    };

    socketClient.onUserOnline(handleUserOnline);
    socketClient.onUserOffline(handleUserOffline);

    return () => {
      socketClient.off('user_online', handleUserOnline);
      socketClient.off('user_offline', handleUserOffline);
    };
  }, []);

  const isOnline = useCallback(
    (userId: string) => onlineUsers.has(userId),
    [onlineUsers]
  );

  return { onlineUsers: Array.from(onlineUsers), isOnline };
}
