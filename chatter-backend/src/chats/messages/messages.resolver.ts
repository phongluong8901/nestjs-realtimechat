import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { MessagesService } from './messages.service';
import { GqlAuthGuard } from 'src/auth/guards/gql-auth.guard';
import { Inject, UseGuards } from '@nestjs/common';
import { CreateMessageInput } from './dto/create-message.input';
import { CurrentUser } from 'src/auth/current-user.decorator';
import type { TokenPayload } from 'src/auth/strategies/token-payload.interface';
import { GetMessageArgs } from './dto/get-message.args';
import { Message } from './entities/message.entity';
import { PUB_SUB } from 'common/constants/injection-token';
import { PubSub } from 'graphql-subscriptions';
import { MESSAGE_CREATED } from 'common/constants/pubsub-triggers';
import { MessageCreatedArgs } from './dto/message-created.args';

@Resolver(() => Message)
export class MessagesResolver {
  constructor(
    private readonly messagesService: MessagesService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Mutation(() => Message)
  @UseGuards(GqlAuthGuard)
  async createMessage(
    @Args('createMessageInput') createMessageInput: CreateMessageInput,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.messagesService.createMessage(createMessageInput, user._id);
  }

  @Query(() => [Message], { name: 'messages' })
  @UseGuards(GqlAuthGuard)
  async getMessages(
    @Args() getMessagesArgs: GetMessageArgs,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.messagesService.getMessages(getMessagesArgs, user._id);
  }

  @Subscription(() => Message, {
    // payload là dữ liệu từ pubsub.publish
    // variables là biến chatId người dùng gửi lên
    filter: (payload, variables) => {
      // Chỉ đẩy tin nhắn đến đúng phòng chat (chatId khớp)
      return payload.messageCreated.chatId === variables.chatId;
    },
  })
  @UseGuards(GqlAuthGuard) // Đảm bảo Guard này hỗ trợ cả Websocket
  async messageCreated(
    @Args() _messageCreatedArgs: MessageCreatedArgs,
    @CurrentUser() user: TokenPayload,
  ) {
    return this.messagesService.messageCreated(_messageCreatedArgs, user._id);
  }
}
