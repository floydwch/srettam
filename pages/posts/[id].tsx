import { useRouter } from 'next/router'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import withApollo from '../../libs/withApollo'
import { getDataFromTree } from '@apollo/react-ssr'

const QUERY = gql`
  query Post($id: ID!) {
    post(id: $id) {
      id
      title
      content
    }
  }
`

const PostPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { loading, data } = useQuery(QUERY, { variables: { id } })

  if (loading || !data) {
    return <h1>loading...</h1>
  }

  const { post } = data

  return (
    <article>
      <h1>{post?.title}</h1>
      {post?.content}
    </article>
  )
}

export default withApollo({ uri: 'http://localhost:3000/api/graphql' })(
  PostPage,
  {
    getDataFromTree,
  }
)
