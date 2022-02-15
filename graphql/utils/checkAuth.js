const jwt = require('jsonwebtoken')

module.exports = () => next => async (parent, args, ctx, info) => {
   const header = ctx.req?.headers.authorization;
   if (!header) throw Error('You are not authorized')

   const token = header.split(' ')[1];
   const user = jwt.verify(token, process.env.SECRET)

   return next(parent, args, { ...ctx, user }, info);
}

