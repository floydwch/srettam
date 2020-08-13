import nextWithApollo from 'next-with-apollo'
import ApolloClient, { InMemoryCache } from 'apollo-boost'
import { ApolloProvider } from '@apollo/react-hooks'

const withApollo = (config) =>
  nextWithApollo(
    ({ initialState }) => {
      return new ApolloClient({
        cache: new InMemoryCache().restore(initialState || {}),
        ...config,
      })
    },
    {
      render: ({ Page, props }) => {
        return (
          <ApolloProvider client={props.apollo}>
            <Page {...props} />
          </ApolloProvider>
        )
      },
    }
  )

export default withApollo
