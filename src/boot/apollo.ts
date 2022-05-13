/* eslint-disable */
import { boot } from 'quasar/wrappers';
import { DefaultApolloClient } from '@vue/apollo-composable';
import {
  ApolloClient,
  createHttpLink,
  InMemoryCache
} from '@apollo/client/core';

const httpLink = createHttpLink({
  uri: process.env.ACCOUNTS_API_ENDPOINT
});

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  link: httpLink,
  cache
});

export default boot(({ app }) => {
  app.provide(DefaultApolloClient, apolloClient);
});
