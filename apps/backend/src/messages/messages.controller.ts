import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateThreadDto } from './dto/create-thread.dto';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Post('threads')
  async createThread(
    @CurrentUser('userId') userId: string,
    @Body() createThreadDto: CreateThreadDto,
  ) {
    return this.messagesService.createThread(userId, createThreadDto);
  }

  @Get('threads')
  async getUserThreads(@CurrentUser('userId') userId: string) {
    return this.messagesService.getUserThreads(userId);
  }

  @Get('threads/:threadId')
  async getThread(
    @CurrentUser('userId') userId: string,
    @Param('threadId') threadId: string,
  ) {
    return this.messagesService.getThread(userId, threadId);
  }

  @Get('threads/:threadId/messages')
  async getThreadMessages(
    @CurrentUser('userId') userId: string,
    @Param('threadId') threadId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.messagesService.getThreadMessages(
      userId,
      threadId,
      page ? parseInt(page, 10) : 1,
      limit ? parseInt(limit, 10) : 100,
    );
  }

  @Post('threads/:threadId/messages')
  async sendMessage(
    @CurrentUser('userId') userId: string,
    @Param('threadId') threadId: string,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    return this.messagesService.sendMessage(userId, threadId, sendMessageDto);
  }

  @Patch('threads/:threadId/read')
  async markAsRead(
    @CurrentUser('userId') userId: string,
    @Param('threadId') threadId: string,
  ) {
    return this.messagesService.markMessagesAsRead(userId, threadId);
  }

  @Get('unread-count')
  async getUnreadCount(@CurrentUser('userId') userId: string) {
    return this.messagesService.getUnreadCount(userId);
  }
}
