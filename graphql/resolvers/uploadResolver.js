const { composeResolvers } = require('@graphql-tools/resolvers-composition')
const { ApolloError, AuthenticationError, ForbiddenError } = require('apollo-server-express')
const checkAuth = require('../utils/checkAuth')
const cloudinary = require('cloudinary').v2

const resolvers = {
   Mutation: {
      background: async (_, { image }, { models, user }) => {
         try {
            const userModel = await models.User.findById(user.id);
            if (!userModel) throw new ForbiddenError('User not found')

            const stream = cloudinary.uploader.upload_stream({ folder: "Social_bg" }, async (error, result) => {
               if (error || !result) throw new Error('Upload error')

               await userModel.updateOne({ background: result.secure_url })
               await userModel.save()
            })
            const { file: { createReadStream } } = await image;
            await createReadStream().pipe(stream)
            return true;
         } catch (err) {
            throw new ApolloError(err.message)
         }
      },

      avatar: async (_, { image }, { models, user }) => {
         try {
            const userModel = await models.User.findById(user.id);
            if (!userModel) throw new ForbiddenError('User not found')

            const stream = cloudinary.uploader.upload_stream({ folder: "Social_avatars" }, async (error, result) => {
               if (error || !result) throw new Error('Upload error')

               await userModel.updateOne({ avatar: result.secure_url })
               await userModel.save()
            })
            const { file: { createReadStream } } = await image;
            await createReadStream().pipe(stream)
            return true;
         } catch (err) {
            throw new ApolloError(err.message)
         }
      }
   }
}

const composition = {
   'Mutation.{background, avatar}': [checkAuth()]
}

module.exports = composeResolvers(resolvers, composition)