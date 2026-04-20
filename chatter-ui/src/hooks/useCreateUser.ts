import { graphql } from "../gql";
import { useMutation } from "@apollo/client/react";

// Cấu trúc này phải khớp chính xác với những gì bạn truyền vào 'variables'
// interface CreateUserVariables {
//   createUserInput: {
//     email: string;
//     password: string;
//   };
// }

const createUserDocument = graphql(`
  mutation CreateUser($createUserInput: CreateUserInput!) {
    createUser(createUserInput: $createUserInput) {
      _id
      email
    }
  }
`);

const useCreateUser = () => {
  // Tham số đầu tiên là kiểu dữ liệu trả về (User)
  // Tham số thứ hai là kiểu dữ liệu của biến truyền vào (CreateUserVariables)
  return useMutation(createUserDocument);
};

export { useCreateUser };
