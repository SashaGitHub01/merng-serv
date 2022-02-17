const env = require('dotenv')
env.config()
const express = require('express')
const cors = require('cors')
const { ApolloServer } = require('apollo-server-express')
const mongoose = require('mongoose')
require('./core/transport')
require('./core/cloudinary')
const { graphqlUploadExpress } = require('graphql-upload')
const defs = require('./graphql/typeDefs/index')
const models = require('./models/index')
const resolvers = require('./graphql/resolvers/index')
const { constraintDirective, constraintDirectiveTypeDefs } = require('graphql-constraint-directive')
const { makeExecutableSchema } = require('@graphql-tools/schema')

const PORT = process.env.PORT || 3005
const app = express()
const corsOptions = {
   credentials: true,
   origin: [process.env.CLIENT, 'https://agitated-bhabha-ba93cb.netlify.app', 'https://studio.apollographql.com']
}

app.use(cors(corsOptions))
app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }))

//apollo
let schema = makeExecutableSchema({ typeDefs: [constraintDirectiveTypeDefs, defs], resolvers })
schema = constraintDirective()(schema)

const startApollo = async () => {
   const server = new ApolloServer({
      upload: false,
      schema,
      context: ({ req }) => {

         return {
            req,
            models
         }
      }
   })
   await server.start()

   server.applyMiddleware({
      app, path: '/graphql', cors: corsOptions
   })
}

//initialize
const start = async () => {
   try {
      await mongoose.connect(process.env.MONGODB, { autoIndex: false, useNewUrlParser: true })
      await app.listen(PORT)
      await startApollo()
      console.log(`Server running at`, PORT);
   } catch (err) {
      console.log(err);
   }
}

start()