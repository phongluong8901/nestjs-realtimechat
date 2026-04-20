import { Injectable } from '@nestjs/common';
import { CreateChatInput } from './dto/create-chat.input';
import { UpdateChatInput } from './dto/update-chat.input';
import { ChatsRepository } from './chats.repository';

@Injectable()
export class ChatsService {
  constructor(private readonly chatsRespository: ChatsRepository) {}

  create(createChatInput: CreateChatInput, userId: string) {
    return this.chatsRespository.create({
      ...createChatInput,
      userId,
      userIds: createChatInput.userIds || [],
      messages: [],
    });
  }

  async findAll(userId: string) {
    return this.chatsRespository.find({
      ...this.userChatfilter(userId),
    });
  }

  async findOne(_id: string) {
    return this.chatsRespository.findOne({ _id });
  }

  userChatfilter(userId: string) {
    return {
      $or: [{ userId }, { userIds: { $in: [userId] } }, { isPrivate: false }],
    };
  }

  update(id: number, updateChatInput: UpdateChatInput) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
