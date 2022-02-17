const { gql } = require('apollo-server-express')

module.exports = gql`
   extend type Query {
      users: [User!]!,
      user(id: ID!): User!
   }

   extend type Mutation {
      signUp(input: UserInput!): User!
      signIn(input: SignInInput!): User!
      auth: User!
      sendSecret(input: EmailInput!): Boolean!
      changePassword(input: PasswordInput!): User!
   }
   
   type User {
      id: ID!,
      username: String!,
      password:String!,
      email: String!,
      avatar: String!,
      token: String,
      background: String,
   }

   type Token {
      token: String!
   }

   input EmailInput {
      email: String!  @constraint (format: "email", minLength: 5)
   }


   input SignInInput {
      password:String!, @constraint (minLength: 5)
      email: String!  @constraint (format: "email", minLength: 5)
   }

   input PasswordInput {
      password: String!, @constraint (minLength: 5)
      secret: String!
   }

   input UserInput {
      username: String!, @constraint (minLength: 2)
      password:String!, @constraint (minLength: 5)
      email: String! @constraint (format: "email", minLength: 5)
   }
`