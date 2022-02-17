const { gql } = require('apollo-server-express')

module.exports = gql`
   extend type Mutation {
      background(image: Upload!): Boolean!
      avatar(image: Upload!): Boolean!
   }
   
`