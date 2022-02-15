const { model, Schema } = require('mongoose')

const postSchema = new Schema({
   user: {
      type: Schema.Types.ObjectId,
      ref: "User"
   },

   body: {
      type: String,
      required: true
   },

   likes: [{
      type: Schema.Types.ObjectId,
      ref: "Like"
   }],

   comments: [{
      type: Schema.Types.ObjectId,
      ref: "Comment"
   }],


}, { timestamps: true })

module.exports = model('Post', postSchema)
