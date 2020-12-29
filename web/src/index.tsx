import React from 'react'
import ReactDOM from 'react-dom'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  from,
} from '@apollo/client'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { TokenRefreshLink } from 'apollo-link-token-refresh'
import jwtDecode from 'jwt-decode'

import App from './App'
import { getAccessToken, setAccessToken } from './accessToken'

const authLink = setContext((_, { headers }) => {
  const token = getAccessToken()
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  if (graphQLErrors) {
    console.log({ graphQLErrors })
  }

  forward(operation)
})

const httpLink = new HttpLink({
  uri: process.env.API_URI || 'http://localhost:4000/graphql',
  credentials: 'include',
})

const tokenRefreshLink = new TokenRefreshLink({
  accessTokenField: 'accessToken',
  isTokenValidOrUndefined: () => {
    const token = getAccessToken()
    if (!token) {
      return true
    }

    try {
      const { exp } = jwtDecode(token) as any

      return Date.now() < exp * 1000
    } catch {
      return false
    }
  },
  fetchAccessToken: () => {
    return fetch('http://localhost:4000/refresh_token', {
      method: 'POST',
      credentials: 'include',
    })
  },
  handleFetch: setAccessToken,

  handleError: err => {
    console.warn('Your refresh token is invalid. Try to relogin')
    console.error(err)
  },
})

const client = new ApolloClient({
  link: from([tokenRefreshLink, authLink.concat(httpLink), errorLink]),
  cache: new InMemoryCache(),
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
)
