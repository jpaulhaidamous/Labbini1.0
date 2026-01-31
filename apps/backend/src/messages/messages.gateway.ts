import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagesService } from './messages.service';
import { SendMessageDto } from './dto/send-message.dto';
import { Logger, UseGuards } from '@nestjs/common';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  email?: string;
}

@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/messages',
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(MessagesGateway.name);
  private onlineUsers = new Map<string, string>(); // userId -> socketId

  constructor(
    private jwtService: JwtService,
    private messagesService: MessagesService,
  ) {}

  /**
   * Handle new WebSocket connection
   */
  async handleConnection(client: AuthenticatedSocket) {
    try {
      // Extract token from handshake
      const token =
        client.handshake.auth?.token ||
        client.handshake.headers?.authorization?.replace('Bearer ', '');

      if (!token) {
        this.logger.warn('Client connection rejected: No token provided');
        client.disconnect();
        return;
      }

      // Verify JWT token
      const payload = await this.jwtService.verifyAsync(token);
      client.userId = payload.sub;
      client.email = payload.email;

      if (!client.userId) {
        this.logger.warn('Client connection rejected: No user ID in token');
        client.disconnect();
        return;
      }

      // Mark user as online
      this.onlineUsers.set(client.userId, client.id);

      // Notify other users that this user is online
      this.server.emit('user_online', {
        userId: client.userId,
        timestamp: new Date(),
      });

      this.logger.log(
        `Client connected: ${client.id} (User: ${client.userId})`,
      );
    } catch (error) {
      this.logger.error('Connection authentication failed:', error.message);
      client.disconnect();
    }
  }

  /**
   * Handle WebSocket disconnection
   */
  handleDisconnect(client: AuthenticatedSocket) {
    if (client.userId) {
      // Remove from online users
      this.onlineUsers.delete(client.userId);

      // Notify other users that this user is offline
      this.server.emit('user_offline', {
        userId: client.userId,
        timestamp: new Date(),
      });

      this.logger.log(
        `Client disconnected: ${client.id} (User: ${client.userId})`,
      );
    }
  }

  /**
   * Handle user joining a thread room
   */
  @SubscribeMessage('join_thread')
  async handleJoinThread(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { threadId: string },
  ) {
    try {
      const { threadId} = data;

      if (!client.userId) {
        return { success: false, error: 'Not authenticated' };
      }

      // Verify user has access to this thread
      const thread = await this.messagesService.getThread(
        client.userId,
        threadId,
      );

      // Join the thread room
      client.join(`thread:${threadId}`);

      this.logger.log(
        `User ${client.userId} joined thread ${threadId} (Socket: ${client.id})`,
      );

      // Mark messages as read when joining thread
      await this.messagesService.markMessagesAsRead(client.userId, threadId);

      return {
        success: true,
        thread,
      };
    } catch (error) {
      this.logger.error('Error joining thread:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Handle user leaving a thread room
   */
  @SubscribeMessage('leave_thread')
  handleLeaveThread(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { threadId: string },
  ) {
    const { threadId } = data;
    client.leave(`thread:${threadId}`);

    this.logger.log(
      `User ${client.userId} left thread ${threadId} (Socket: ${client.id})`,
    );

    return { success: true };
  }

  /**
   * Handle sending a message
   */
  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { threadId: string; message: SendMessageDto },
  ) {
    try {
      const { threadId, message: messageDto } = data;

      if (!client.userId) {
        return { success: false, error: 'Not authenticated' };
      }

      // Send message via service
      const message = await this.messagesService.sendMessage(
        client.userId,
        threadId,
        messageDto,
      );

      // Emit message to all users in the thread room
      this.server.to(`thread:${threadId}`).emit('message_received', {
        message,
        threadId,
      });

      // Also emit to sender (for confirmation)
      client.emit('message_sent', {
        message,
        threadId,
      });

      this.logger.log(
        `Message sent in thread ${threadId} by user ${client.userId}`,
      );

      return {
        success: true,
        message,
      };
    } catch (error) {
      this.logger.error('Error sending message:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Handle typing indicator start
   */
  @SubscribeMessage('typing_start')
  handleTypingStart(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { threadId: string },
  ) {
    const { threadId } = data;

    // Broadcast to others in thread (exclude sender)
    client.to(`thread:${threadId}`).emit('user_typing', {
      userId: client.userId,
      threadId,
      isTyping: true,
    });

    return { success: true };
  }

  /**
   * Handle typing indicator stop
   */
  @SubscribeMessage('typing_stop')
  handleTypingStop(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { threadId: string },
  ) {
    const { threadId } = data;

    // Broadcast to others in thread (exclude sender)
    client.to(`thread:${threadId}`).emit('user_typing', {
      userId: client.userId,
      threadId,
      isTyping: false,
    });

    return { success: true };
  }

  /**
   * Handle marking messages as read
   */
  @SubscribeMessage('mark_read')
  async handleMarkRead(
    @ConnectedSocket() client: AuthenticatedSocket,
    @MessageBody() data: { threadId: string },
  ) {
    try {
      const { threadId } = data;

      if (!client.userId) {
        return { success: false, error: 'Not authenticated' };
      }

      await this.messagesService.markMessagesAsRead(client.userId, threadId);

      // Notify other participants that messages were read
      client.to(`thread:${threadId}`).emit('messages_read', {
        userId: client.userId,
        threadId,
        timestamp: new Date(),
      });

      return { success: true };
    } catch (error) {
      this.logger.error('Error marking messages as read:', error.message);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Get online status of a user
   */
  isUserOnline(userId: string): boolean {
    return this.onlineUsers.has(userId);
  }

  /**
   * Get all online users
   */
  @SubscribeMessage('get_online_users')
  handleGetOnlineUsers(@ConnectedSocket() client: AuthenticatedSocket) {
    const onlineUserIds = Array.from(this.onlineUsers.keys());
    return {
      success: true,
      onlineUsers: onlineUserIds,
    };
  }
}
