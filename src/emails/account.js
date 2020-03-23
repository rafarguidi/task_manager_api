const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'rafarguidi@gmail.com',
    subject: 'Thanks for use the Task APP.',
    text: `Welcome to the app, ${name}. Let me know how you get along with the app.`
  })
}

const sendCanceletionEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: 'rafarguidi@gmail.com',
    subject: 'Sorry to see you go!',
    text: `Goodbye ${name}. I hope to see you back sometime soon.`
  })
}

module.exports = {
  sendWelcomeEmail,
  sendCanceletionEmail
}