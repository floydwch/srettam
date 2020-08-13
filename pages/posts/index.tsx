import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import withApollo from '../../libs/withApollo'
import { getDataFromTree } from '@apollo/react-ssr'
import Link from 'next/link'
import styled from 'styled-components'

const Container = styled.div`
  padding: 48px 0 0;

  a {
    text-decoration: underline;
    color: blue;
  }
`

const NewPostButton = styled.button`
  float: right;
  cursor: pointer;
`

const LoadMoreButton = styled.button`
  display: block;
  margin: 0 auto;
  cursor: pointer;
`

const QUERY = gql`
  query Posts($cursor: String) {
    posts(since: $cursor, limit: 3) {
      edges {
        node {
          id
          title
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`

const PostsPage = () => {
  const { loading, data, fetchMore } = useQuery(QUERY)
  const handleLoadMore = () => {
    fetchMore({
      variables: {
        cursor: data.posts.pageInfo.endCursor,
      },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        const newEdges = fetchMoreResult.posts.edges
        const pageInfo = fetchMoreResult.posts.pageInfo

        return newEdges.length
          ? {
              posts: {
                __typename: previousResult.posts.__typename,
                edges: [...previousResult.posts.edges, ...newEdges],
                pageInfo,
              },
            }
          : previousResult
      },
    })
  }

  if (loading || !data) {
    return <h1>loading...</h1>
  }

  const posts = data.posts.edges.map((edge) => edge.node)

  const postList = posts.map((post) => (
    <li key={post.id}>
      <Link href="/posts/[id]" as={`/posts/${post.id}`}>
        <a>{post.title}</a>
      </Link>
    </li>
  ))

  const loadMoreButton = data.posts.pageInfo.hasNextPage && (
    <LoadMoreButton onClick={handleLoadMore}>Load more</LoadMoreButton>
  )

  return (
    <Container>
      <Link href="/posts/new">
        <NewPostButton>New post</NewPostButton>
      </Link>
      <ul>{postList}</ul>
      {loadMoreButton}
    </Container>
  )
}

export default withApollo({ uri: 'http://localhost:3000/api/graphql' })(
  PostsPage,
  {
    getDataFromTree,
  }
)
