import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Create a new message thread
   */
  async createThread(userId: string, createThreadDto: CreateThreadDto) {
    const { participantIds, jobId, contractId } = createThreadDto;

    // Ensure current user is in participants
    if (!participantIds.includes(userId)) {
      participantIds.push(userId);
    }

    // Validate participants exist
    const users = await this.prisma.user.findMany({
      where: { id: { in: participantIds } },
    });

    if (users.length !== participantIds.length) {
      throw new BadRequestException('One or more participant IDs are invalid');
    }

    // Check if thread already exists with same participants
    const existingThread = await this.prisma.messageThread.findFirst({
      where: {
        AND: [
          { participantIds: { hasEvery: participantIds } },
          { participantIds: { isEmpty: false } },
          jobId ? { jobId } : {},
          contractId ? { contractId } : {},
        ],
      },
    });

    if (existingThread) {
      return existingThread;
    }

    // Create new thread
    return this.prisma.messageThread.create({
      data: {
        participantIds,
        jobId,
        contractId,
      },
    });
  }

  /**
   * Get all threads for a user
   */
  async getUserThreads(userId: string) {
    const threads = await this.prisma.messageThread.findMany({
      where: {
        participantIds: {
          has: userId,
        },
      },
      include: {
        messages: {
          take: 1,
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            content: true,
            contentType: true,
            isRead: true,
            createdAt: true,
            sender: {
              select: {
                id: true,
                email: true,
                profile: {
                  select: {
                    displayNameEn: true,
                    displayNameAr: true,
                    avatarUrl: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: { lastMessageAt: 'desc' },
    });

    // Get other participants' info for each thread
    const threadsWithParticipants = await Promise.all(
      threads.map(async (thread) => {
        const otherParticipantIds = thread.participantIds.filter(
          (id) => id !== userId,
        );
        const participants = await this.prisma.user.findMany({
          where: { id: { in: otherParticipantIds } },
          select: {
            id: true,
            email: true,
            role: true,
            profile: {
              select: {
                displayNameEn: true,
                displayNameAr: true,
                avatarUrl: true,
              },
            },
          },
        });

        // Count unread messages
        const unreadCount = await this.prisma.message.count({
          where: {
            threadId: thread.id,
            senderId: { not: userId },
            isRead: false,
          },
        });

        return {
          ...thread,
          participants,
          unreadCount,
        };
      }),
    );

    return threadsWithParticipants;
  }

  /**
   * Get a specific thread by ID
   */
  async getThread(userId: string, threadId: string) {
    const thread = await this.prisma.messageThread.findUnique({
      where: { id: threadId },
    });

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    // Check if user is a participant
    if (!thread.participantIds.includes(userId)) {
      throw new ForbiddenException('You are not a participant in this thread');
    }

    // Get other participants
    const otherParticipantIds = thread.participantIds.filter(
      (id) => id !== userId,
    );
    const participants = await this.prisma.user.findMany({
      where: { id: { in: otherParticipantIds } },
      select: {
        id: true,
        email: true,
        role: true,
        profile: {
          select: {
            displayNameEn: true,
            displayNameAr: true,
            avatarUrl: true,
          },
        },
      },
    });

    return {
      ...thread,
      participants,
    };
  }

  /**
   * Get messages in a thread with pagination
   */
  async getThreadMessages(
    userId: string,
    threadId: string,
    page: number = 1,
    limit: number = 100,
  ) {
    // Verify user is a participant
    const thread = await this.prisma.messageThread.findUnique({
      where: { id: threadId },
      select: { participantIds: true },
    });

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    if (!thread.participantIds.includes(userId)) {
      throw new ForbiddenException('You are not a participant in this thread');
    }

    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      this.prisma.message.findMany({
        where: { threadId },
        include: {
          sender: {
            select: {
              id: true,
              email: true,
              profile: {
                select: {
                  displayNameEn: true,
                  displayNameAr: true,
                  avatarUrl: true,
                },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.message.count({ where: { threadId } }),
    ]);

    return {
      messages: messages.reverse(), // Reverse to show oldest first
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Send a message in a thread
   */
  async sendMessage(
    userId: string,
    threadId: string,
    sendMessageDto: SendMessageDto,
  ) {
    // Verify thread exists and user is participant
    const thread = await this.prisma.messageThread.findUnique({
      where: { id: threadId },
      select: { participantIds: true },
    });

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    if (!thread.participantIds.includes(userId)) {
      throw new ForbiddenException('You are not a participant in this thread');
    }

    // Create message and update thread's lastMessageAt
    const message = await this.prisma.message.create({
      data: {
        threadId,
        senderId: userId,
        content: sendMessageDto.content,
        contentType: sendMessageDto.contentType,
        attachments: sendMessageDto.attachments,
      },
      include: {
        sender: {
          select: {
            id: true,
            email: true,
            profile: {
              select: {
                displayNameEn: true,
                displayNameAr: true,
                avatarUrl: true,
              },
            },
          },
        },
      },
    });

    // Update thread's lastMessageAt
    await this.prisma.messageThread.update({
      where: { id: threadId },
      data: { lastMessageAt: new Date() },
    });

    return message;
  }

  /**
   * Mark messages as read
   */
  async markMessagesAsRead(userId: string, threadId: string) {
    // Verify user is participant
    const thread = await this.prisma.messageThread.findUnique({
      where: { id: threadId },
      select: { participantIds: true },
    });

    if (!thread) {
      throw new NotFoundException('Thread not found');
    }

    if (!thread.participantIds.includes(userId)) {
      throw new ForbiddenException('You are not a participant in this thread');
    }

    // Mark all unread messages from other senders as read
    await this.prisma.message.updateMany({
      where: {
        threadId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });

    return { success: true };
  }

  /**
   * Get unread message count for user
   */
  async getUnreadCount(userId: string) {
    // Get all threads user is in
    const threads = await this.prisma.messageThread.findMany({
      where: {
        participantIds: { has: userId },
      },
      select: { id: true },
    });

    const threadIds = threads.map((t) => t.id);

    // Count unread messages across all threads
    const unreadCount = await this.prisma.message.count({
      where: {
        threadId: { in: threadIds },
        senderId: { not: userId },
        isRead: false,
      },
    });

    return { unreadCount };
  }
}
