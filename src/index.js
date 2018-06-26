import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { ApolloLink, split } from 'apollo-client-preset';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { BrowserRouter } from 'react-router-dom';
import { AUTH_TOKEN } from './constants';

// endpoint of gql server
const httpLink = new HttpLink({ uri: 'http://localhost:4000'});

// all requests are sent with auth token if present
const middlewareAuthLink = new ApolloLink((operation, forward) => {
  const token = localStorage.getItem(AUTH_TOKEN);
  const authorizationHeader = token ? `Bearer ${token}` : null;
  operation.setContext({
    headers: {
      authorization: authorizationHeader
    }
  });
  return forward(operation);
});

const httpLinkWithAuthToken = middlewareAuthLink.concat(httpLink);

// web socket instead of http for subscriptions
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000',
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem(AUTH_TOKEN)
    }
  }
});

// routes request to middleware link
const link = split(
  // first arg is test func that returns bool
  // in this case, checks to make sure the operation is a subscription
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query);
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  // if test is true, forward to second arg
  wsLink,
  // if test is false, forward to third arg
  httpLinkWithAuthToken
)

// apollo client
const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client} >
      <App />
    </ApolloProvider>
  </BrowserRouter>, 
  document.getElementById('root')
);

registerServiceWorker();
