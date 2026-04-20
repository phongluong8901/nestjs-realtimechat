import { ApolloCache } from "@apollo/client";
import { Message } from "../gql/graphql";
import { getMessagesDocument } from "../hooks/useGetMessages";

// GIẢI PHÁP: Xóa hoàn toàn phần <any> ở đây
export const updateMessages = (cache: ApolloCache, message: Message) => {
  const messagesQueryOptions = {
    query: getMessagesDocument,
    variables: {
      chatId: message.chatId,
    },
  };

  // Đọc dữ liệu hiện tại (ép kiểu ở đây thay vì ở tham số hàm)
  const existingData = cache.readQuery<any>(messagesQueryOptions);

  if (existingData) {
    // Tránh trùng lặp tin nhắn
    const isDuplicate = existingData.messages.some(
      (m: any) => m._id === message._id,
    );

    if (!isDuplicate) {
      cache.writeQuery({
        ...messagesQueryOptions,
        data: {
          messages: [...existingData.messages, message],
        },
      });
    }
  }
};
