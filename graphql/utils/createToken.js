const jwt = require('jsonwebtoken')

module.exports = (user) => {
   const { username, id } = user;
   return jwt.sign({ username, id }, process.env.SECRET, { expiresIn: '7d' })
}
