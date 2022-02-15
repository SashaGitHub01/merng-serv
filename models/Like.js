const { model, Schema } = require('mongoose')

const likeSchema = new Schema({
   user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
   },

   post: {
      type: Schema.Types.ObjectId,
      ref: 'Post'
   },
})

module.exports = model('Like', likeSchema)