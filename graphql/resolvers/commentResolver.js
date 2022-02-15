const { composeResolvers } = require('@graphql-tools/resolvers-composition')
const { ApolloError, AuthenticationError, ForbiddenError } = require('apollo-server-express')
const checkAuth = require('../utils/checkAuth')

const resolvers = {
   Query: {
      comments: async (_, { id }, { models }) => {
         try {
            const comms = await models.Comment.find({ post: id }).populate('user post')

            return comms;
         } catch (err) {
            throw new ApolloError(err.message)
         }
      },
   },

   Mutation: {
      createComment: async (_, { input }, { models, user }) => {
         try {
            const post = await models.Post.findById(input.id);
            if (!post) throw ForbiddenError('Post doesnt exist')

            const comment = await models.Comment.create({
               post: input.id,
               body: input.body,
               user: user.id
            })

            post.comments.push(comment._id);
            await post.save()

            await comment?.populate('user post')
            return comment;
         } catch (err) {
            throw new ApolloError(err.message)
         }
      },

      deleteComment: async (_, { input }, { models, user }) => {
         try {
            const post = await models.Post.findById(input.post);
            if (!post) throw new ForbiddenError('Post doesnt exist')

            const comment = await models.Comment.findById(input.id);
            if (comment?.user.toString() != user.id) throw new ForbiddenError('Invalid request')

            await comment.remove()
            await post.comments.pull(input.id)
            await post.populate('comments')
            await post.save()

            return post;
         } catch (err) {
            throw new ApolloError(err.message)
         }
      },
   }
}

const composition = {
   "Mutation.{createComment, deleteComment}": [checkAuth()]
}

module.exports = composeResolvers(resolvers, composition)