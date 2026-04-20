import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  from,
  split,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { API_URL, WS_URL } from "./urls";
import excludedRoutes from "./excluded-routes";
import router from "../components/Routes";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

// 1. Dùng kiểu 'any' cho clientInstance và không dùng ngoặc nhọn <>
const onLogout = async (clientInstance: any) => {
  if (!excludedRoutes.includes(window.location.pathname)) {
    await clientInstance.clearStore();
    router.navigate("/login");
  }
};

// 2. Ép kiểu tham số truyền vào onError là 'any' để bóc tách thoải mái
const errorLink = onError((errorResponse: any) => {
  const { graphQLErrors, networkError } = errorResponse;

  if (graphQLErrors) {
    for (const err of graphQLErrors) {
      // Truy cập extensions bằng cách ép kiểu qua any
      const statusCode = (err as any).extensions?.originalError?.statusCode;

      if (statusCode === 401 || err.message === "Unauthorized") {
        onLogout(client);
      }
    }
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

const httpLink = new HttpLink({
  uri: `${API_URL}/graphql`,
  credentials: "include",
});

const wsLink = new GraphQLWsLink(
  createClient({
    url: `ws://${WS_URL}/graphql`,
  }),
);

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query); // Truyền query vào đây
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink, // Link cho subscription (WebSocket)
  httpLink, // Link cho query/mutation (HTTP)
);

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([errorLink, splitLink]),
});

export default client;
