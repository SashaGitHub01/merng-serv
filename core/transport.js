const nodemailer = require('nodemailer')

module.exports = nodemailer.createTransport({
   service: 'gmail',
   auth: {
      user: process.env.GMAIL,
      pass: process.env.GMAIL_PASSWORD
   }
})
