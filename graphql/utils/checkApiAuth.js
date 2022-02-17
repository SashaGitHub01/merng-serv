const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
   try {
      const header = req.headers?.authorization?.split(' ')[1]
      if (!header) return res.status(401)

      const user = jwt.verify(header, process.env.SECRET)
      if (!user) return res.status(401);

      req.user = user;
      return next()
   } catch (err) {
      return next(err)
   }
}

