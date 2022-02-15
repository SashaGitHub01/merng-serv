const { composeResolvers } = require('@graphql-tools/resolvers-composition')
const { ApolloError, AuthenticationError, ForbiddenError } = require('apollo-server-express')
const checkAuth = require('../utils/checkAuth')

const resolvers = {
   Query: {
      likes: async (_, { id }, { models }) => {
         try {
            const likes = await models.Like.find({ user: id })
            return likes
         } catch (err) {
            throw new ApolloError(err.message)
         }
      }
   },

   Mutation: {
      like: async (_, { id }, { models, user }) => {
         try {
            const post = await models.Post.findById(id);
            if (!post) throw new ForbiddenError('Post doesnt exist')

            let like = await models.Like.findOne({ post: id, user: user.id })

            if (like) {
               await post.likes.pull(like._id)
               await like.remove();
            } else {
               like = await models.Like.create({ post: id, user: user.id })
               await post.likes.push(like._id);
            }

            await post.save()
            return like
         } catch (err) {
            throw new ApolloError(err.message)
         }
      }
   },
}

const composition = {
   'Mutation.like': [checkAuth()]
}

module.exports = composeResolvers(resolvers, composition)