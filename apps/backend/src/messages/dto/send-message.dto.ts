import { IsNotEmpty, IsString, IsEnum, IsOptional, IsObject } from 'class-validator';
import { MessageContentType } from '@prisma/client';

export class SendMessageDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsEnum(MessageContentType)
  contentType: MessageContentType = MessageContentType.TEXT;

  @IsOptional()
  @IsObject()
  attachments?: Record<string, any>;
}
