const { composeResolvers } = require('@graphql-tools/resolvers-composition')
const { ApolloError, AuthenticationError, ForbiddenError } = require('apollo-server-express')
const checkAuth = require('../utils/checkAuth')

const resolvers = {
   Query: {
      posts: async (_, args, { models }) => {
         try {
            const posts = await models.Post.find({})
               .sort({ createdAt: 'desc' })
               .populate({ path: 'user' })

            return posts
         } catch (err) {
            throw new ApolloError(err.message)
         }
      },

      post: async (_, { id }, { models }) => {
         try {
            const post = await models.Post.findById(id).populate('user')
            if (!post) throw new ForbiddenError('Invalid post id')

            return post;
         } catch (err) {
            throw new ApolloError(err.message)
         }
      }
   },

   Mutation: {
      createPost: async (_, { input }, { models, user }) => {
         try {
            const post = await models.Post.create({ user: user?.id, body: input.body })
            await post?.populate('user');

            return post;
         } catch (err) {
            throw new ApolloError(err.message)
         }
      },

      deletePost: async (_, { id }, { models, user }) => {
         try {
            const post = await models.Post.findById(id);

            if (user.id !== post.user.toString()) throw new ForbiddenError('Invalid request')

            await post.remove();
            await models.Comment.deleteMany({ post: id })
            await models.Like.deleteMany({ post: id })
            return post;
         } catch (err) {
            throw new ApolloError(err.message)
         }
      }
   },

   Post: {
      likesCount: async (parent) => parent.likes.length,
      commentsCount: async (parent) => parent.comments.length
   }
}

const composition = {
   "Mutation.{createPost, deletePost}": [checkAuth()]
}

module.exports = composeResolvers(resolvers, composition)