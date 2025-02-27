import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';

// HTTP endpoint for queries & mutations
const httpLink = new HttpLink({
  uri: 'https://safe-t.work.gd/graphql',
});

// WebSocket endpoint for subscriptions
const wsLink = new GraphQLWsLink(
  createClient({
    url: 'wss://safe-t.work.gd/graphql',
    connectionParams: {
      reconnect: true,
    },
  })
);

// Split links between HTTP (queries/mutations) and WebSocket (subscriptions)
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink
);

// Create Apollo Client instance
export const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});