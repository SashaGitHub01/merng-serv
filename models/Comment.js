const { model, Schema } = require('mongoose')

const commentSchema = new Schema({
   body: {
      type: String,
      required: true
   },

   user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
   },

   post: {
      type: Schema.Types.ObjectId,
      ref: 'Post'
   },
}, { timestamps: true })

module.exports = model('Comment', commentSchema)
