import { forwardRef, Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesResolver } from './messages.resolver';
import { ChatsModule } from '../chats.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from '../entities/chat.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    forwardRef(() => ChatsModule),
  ],
  providers: [MessagesResolver, MessagesService],
})
export class MessagesModule {}
