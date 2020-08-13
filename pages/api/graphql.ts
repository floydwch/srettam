import { ApolloServer, gql } from 'apollo-server-micro'
import { v4 as uuid } from 'uuid'

import { DocModel } from '../../libs/model'

const typeDefs = gql`
  type Query {
    posts(since: String, limit: Int): PostConnection!
    post(id: ID!): Post
  }

  type Mutation {
    createPost(title: String!, content: String!): ID!
  }

  type Post {
    id: ID!
    title: String
    content: String
  }

  type PostConnection {
    edges: [PostEdge!]!
    pageInfo: PageInfo!
  }

  type PostEdge {
    cursor: String!
    node: Post!
  }

  type PageInfo {
    endCursor: String
    hasNextPage: Boolean!
  }
`

const resolvers = {
  Query: {
    async posts(parent, { since, limit }) {
      await DocModel.load('Post')

      if (since) {
        const sinceId = Buffer.from(since, 'base64').toString('ascii')
        var posts = await DocModel.objects.slice(sinceId, limit + 1)
      } else {
        var posts = await DocModel.objects.slice(0, limit + 1)
      }

      const hasNextPage = posts.length > limit

      return {
        edges: posts.slice(0, limit).map((post) => ({
          cursor: Buffer.from(post.id).toString('base64'),
          node: post,
        })),
        pageInfo: {
          endCursor:
            posts.length > 1
              ? Buffer.from(posts[posts.length - 2].id).toString('base64')
              : null,
          hasNextPage,
        },
      }
    },
    async post(parent, { id }) {
      await DocModel.load('Post')

      const posts = await DocModel.objects.all()

      for (let i = 0; i < posts.length; ++i) {
        if (posts[i].id === id) {
          return posts[i]
        }
      }

      return null
    },
  },
  Mutation: {
    async createPost(parent, { title, content }) {
      await DocModel.load('Post')

      const id = uuid()
      const post = new DocModel({
        id,
        title,
        content,
      })

      await post.save()

      return id
    },
  },
}

const apolloServer = new ApolloServer({ typeDefs, resolvers })

export default apolloServer.createHandler({ path: '/api/graphql' })

export const config = {
  api: {
    bodyParser: false,
  },
}
