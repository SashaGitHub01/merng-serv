const { gql } = require("apollo-server-express");

module.exports = gql`
   extend type Query {
      comments(id: ID!): [Comment!]!
   }

   extend type Mutation {
      createComment(input: CommentInput!): Comment!,
      deleteComment(input: CommentDeleteInput!): Post!
   }

   type Comment {
      id: ID!,
      body: String!,
      user: User!,
      post: Post!,
      createdAt: String!
   }

   input CommentInput {
      body: String!, @constraint (minLength: 1, maxLength: 150),
      id: ID!
   }

   input CommentDeleteInput {
      id: ID!,
      post: ID!
   }
`