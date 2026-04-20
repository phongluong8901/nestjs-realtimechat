import { graphql } from "../gql";
import { getMessagesDocument } from "./useGetMessages";

import { useMutation } from "@apollo/client/react";

const createMessageDocument = graphql(`
  mutation CreateMessage($createMessageInput: CreateMessageInput!) {
    createMessage(createMessageInput: $createMessageInput) {
      ...MessageFragment
    }
  }
`);

const useCreateMessage = (chatId: string) => {
  return useMutation(createMessageDocument, {
    update(cache, { data }) {
      const newMessage = data?.createMessage;
      if (!newMessage) return;

      const messagesQueryOptions = {
        query: getMessagesDocument,
        variables: { chatId },
      };

      // 1. Đọc dữ liệu từ cache
      const existingData = cache.readQuery<any>(messagesQueryOptions);

      // 2. Kiểm tra xem dữ liệu có tồn tại trong cache không
      if (existingData?.messages) {
        // 3. Ghi lại dữ liệu mới vào đúng "ngăn chứa"
        cache.writeQuery({
          ...messagesQueryOptions,
          data: {
            ...existingData,
            // Thêm tin nhắn mới vào cuối mảng hiện có
            messages: [...existingData.messages, newMessage],
          },
        });
      }
    },
  });
};

export { useCreateMessage };
