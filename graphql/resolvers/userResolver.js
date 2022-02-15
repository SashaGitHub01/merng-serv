const { ApolloError, AuthenticationError, ForbiddenError } = require('apollo-server-express')
const bcrypt = require('bcryptjs')
const createToken = require('../utils/createToken')
const checkAuth = require('../utils/checkAuth')
const { composeResolvers } = require('@graphql-tools/resolvers-composition')
const jwt = require('jsonwebtoken')
const transport = require('../../core/transport')

const resolvers = {
   Query: {
      users: async (_, args, { models }) => {
         try {
            const users = await models.User.find();

            return users;
         } catch (err) {
            throw new ApolloError(err.message)
         }
      }
   },

   Mutation: {
      signUp: async (_, { input }, { models }) => {
         try {
            const { email, password, username } = input;
            const check = await models.User.findOne({ email })

            if (check) throw new ForbiddenError('User with this email already exists')

            const hash = await bcrypt.hash(password, 5)
            const data = {
               password: hash,
               username,
               email
            }
            const user = await models.User.create(data)

            const token = createToken(user)
            return { token, ...user.toJSON(), id: user._id }
         } catch (err) {
            throw new ApolloError(err.message)
         }
      },

      signIn: async (_, { input }, { models }) => {
         try {
            const candidate = await models.User.findOne({ email: input.email })
            if (!candidate) throw new AuthenticationError('User doesnt exist')

            const isRight = await bcrypt.compare(input.password, candidate.password);
            if (!isRight) throw new AuthenticationError('Invalid password')

            const token = createToken(candidate);
            return { token, ...candidate.toJSON(), id: candidate._id }
         } catch (err) {
            throw new ApolloError(err.message)
         }
      },

      auth: async (_, args, { models, user }) => {
         try {
            const me = await models.User.findById(user?.id);

            if (!me) throw new AuthenticationError('User not found')

            return { ...me.toJSON(), id: me._id };
         } catch (err) {
            throw new ApolloError(err.message)
         }
      },

      changePassword: async (_, { input }, { models }) => {
         try {
            const { email } = jwt.verify(input.secret, process.env.GMAIL_SECRET);
            if (!email) throw new ForbiddenError('Invalid or expired token')

            const hash = await bcrypt.hash(input.password, 5)
            const user = await models.User.findOneAndUpdate({ email }, { password: hash })

            return { ...user.toJSON(), id: user._id };
         } catch (err) {
            throw new ApolloError(err.message)
         }
      },

      sendSecret: async (_, { input }, { models }) => {
         try {
            const { email } = input;
            const user = await models.User.findOne({ email });
            if (!user) throw new ForbiddenError('User with this email doesnt exist')

            const secret = jwt.sign({ email }, process.env.GMAIL_SECRET, { expiresIn: '15m' })

            await transport.sendMail({
               from: "'MyApp' <process.env.GMAIL>",
               to: email,
               subject: 'We received a request to change your password. If you did not request the password change, please disregard this message.To change your password, we need you to click the link below and follow the instructions:',
               html: `<a href=${process.env.CLIENT}/reset?secret=${secret} style="color: blue; font-size=20px">
                  CHANGE PASSWORD
               </a>`
            })

            return true;
         } catch (err) {
            throw new ApolloError(err.message)
         }
      }
   }
}

const composition = {
   "Mutation.auth": [checkAuth()]
}

module.exports = composeResolvers(resolvers, composition)