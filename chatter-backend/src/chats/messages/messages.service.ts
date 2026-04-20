import { Inject, Injectable } from '@nestjs/common';
import { Types } from 'mongoose'; // 1. Phải import Types từ mongoose
import { ChatsRepository } from '../chats.repository';
import { CreateMessageInput } from './dto/create-message.input';
import { Message } from './entities/message.entity'; // 2. Import đúng Entity Message
import { GetMessageArgs } from './dto/get-message.args';
import { PUB_SUB } from 'common/constants/injection-token';
import { PubSub } from 'graphql-subscriptions';
import { MESSAGE_CREATED } from 'common/constants/pubsub-triggers';
import { MessageCreatedArgs } from './dto/message-created.args';
import { ChatsService } from '../chats.service';

@Injectable()
export class MessagesService {
  constructor(
    private readonly chatsRepository: ChatsRepository,
    private readonly chatsService: ChatsService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {} // Sửa ChatsRepository thành chatsRepository (camelCase)

  async createMessage({ content, chatId }: CreateMessageInput, userId: string) {
    const message: Message = {
      content,
      userId,
      chatId,
      createdAt: new Date(),
      _id: new Types.ObjectId(),
    };

    // 1. Thực hiện update vào Database
    await this.chatsRepository.findOneAndUpdate(
      {
        _id: chatId,
        ...this.chatsService.userChatfilter(userId),
      },
      {
        $push: {
          messages: message,
        },
      },
    );

    await this.pubSub.publish(MESSAGE_CREATED, {
      messageCreated: message,
    });
    return message;
  }

  async getMessages({ chatId }: GetMessageArgs, userId: string) {
    const chat = await this.chatsRepository.findOne({
      _id: chatId,
      ...this.chatsService.userChatfilter(userId),
    });
    return chat?.messages || []; // Trả về mảng rỗng nếu không tìm thấy chat
  }

  async messageCreated({ chatId }: MessageCreatedArgs, userId: string) {
    await this.chatsRepository.findOne({
      _id: chatId,
      ...this.chatsService.userChatfilter(userId),
    });

    // Sử dụng 'as any' hoặc ép kiểu cụ thể hơn để truy cập asyncIterator
    return (this.pubSub as any).asyncIterator(MESSAGE_CREATED);
  }
}
