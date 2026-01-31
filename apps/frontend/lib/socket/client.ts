import { io, Socket } from 'socket.io-client';
import { Message } from '../api/messages';

class SocketClient {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  connect(token: string) {
    if (this.socket?.connected) {
      return this.socket;
    }

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    const socketUrl = backendUrl.replace('/api', '');

    this.socket = io(`${socketUrl}/messages`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: this.maxReconnectAttempts,
    });

    this.setupListeners();

    return this.socket;
  }

  private setupListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      this.reconnectAttempts = 0;
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      this.reconnectAttempts++;

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached');
        this.disconnect();
      }
    });

    this.socket.on('reconnect_attempt', (attemptNumber) => {
      console.log('Reconnection attempt:', attemptNumber);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Reconnected after attempts:', attemptNumber);
      this.reconnectAttempts = 0;
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinThread(threadId: string) {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    this.socket.emit('join_thread', { threadId });
  }

  leaveThread(threadId: string) {
    if (!this.socket) return;
    this.socket.emit('leave_thread', { threadId });
  }

  sendMessage(threadId: string, message: { content: string; contentType?: string }) {
    if (!this.socket) {
      throw new Error('Socket not connected');
    }
    this.socket.emit('send_message', { threadId, message });
  }

  startTyping(threadId: string) {
    if (!this.socket) return;
    this.socket.emit('typing_start', { threadId });
  }

  stopTyping(threadId: string) {
    if (!this.socket) return;
    this.socket.emit('typing_stop', { threadId });
  }

  markAsRead(threadId: string) {
    if (!this.socket) return;
    this.socket.emit('mark_read', { threadId });
  }

  onMessageReceived(callback: (data: { message: Message; threadId: string }) => void) {
    if (!this.socket) return;
    this.socket.on('message_received', callback);
  }

  onMessageSent(callback: (data: { message: Message; threadId: string }) => void) {
    if (!this.socket) return;
    this.socket.on('message_sent', callback);
  }

  onUserTyping(callback: (data: { userId: string; threadId: string; isTyping: boolean }) => void) {
    if (!this.socket) return;
    this.socket.on('user_typing', callback);
  }

  onMessagesRead(callback: (data: { userId: string; threadId: string; timestamp: Date }) => void) {
    if (!this.socket) return;
    this.socket.on('messages_read', callback);
  }

  onUserOnline(callback: (data: { userId: string; timestamp: Date }) => void) {
    if (!this.socket) return;
    this.socket.on('user_online', callback);
  }

  onUserOffline(callback: (data: { userId: string; timestamp: Date }) => void) {
    if (!this.socket) return;
    this.socket.on('user_offline', callback);
  }

  off(event: string, callback?: (...args: any[]) => void) {
    if (!this.socket) return;
    this.socket.off(event, callback);
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getSocket(): Socket | null {
    return this.socket;
  }
}

export const socketClient = new SocketClient();
