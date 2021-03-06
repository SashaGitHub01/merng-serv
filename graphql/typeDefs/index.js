const { gql } = require('apollo-server-express')
const postSchema = require('./postSchema')
const userSchema = require('./userSchema')
const commentSchema = require('./commentSchema')
const likeSchema = require('./likeSchema')
const uploadSchema = require('./uploadSchema')

const linkSchema = gql`
   scalar Upload

   type Query {
      _: Boolean!
   }

   type Mutation {
      _: Boolean!
   }

   type Subscription {
      _: Boolean!
   }
`

module.exports = [linkSchema, userSchema, postSchema, commentSchema, likeSchema, uploadSchema]