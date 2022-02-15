const { gql } = require("apollo-server-express")

module.exports = gql`
   extend type Query {
      likes(id: ID!): [Like!]!
   }

   extend type Mutation {
      like(id: ID!): Like!
   }

   type Like {
      id: ID!,
      user: String!,
      post: String!
   }
`