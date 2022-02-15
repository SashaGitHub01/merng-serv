const { gql } = require("apollo-server-express");

module.exports = gql`
   extend type Query {
      posts: [Post!]!
      post(id: ID!): Post!
   }

   extend type Mutation {
     createPost(input: PostInput!): Post!
     deletePost(id: ID!): Post!
   }

   type Post {
      id: ID!,
      body: String!,
      user: User!,
      comments: [Comment!]!,
      likes: [Like!]!,
      createdAt: String!,
      likesCount: Int!,
      commentsCount: Int,
   }

   input PostInput {
      body: String! @constraint (minLength: 1)
   }
`