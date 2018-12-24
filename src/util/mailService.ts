import mailer from 'nodemailer'
import Message from '../models/Message'
import secrets from '../../config'

export const sendMail = (text, email, messageInstance) => {
  const user: string = secrets.USER_MAIL
  const pass: string = secrets.PASS_MAIL
  const to: string = email
  const subject: string = 'Reminder App'

  const transporter = mailer.createTransport({
    auth: {
      user,
      pass
    },
    service: 'gmail'
  })

  const mailOptions: object = {
    from: user,
    to,
    subject,
    html: `<b>${text}</b>`
  }

  transporter.sendMail(mailOptions, error => {
    if (error) throw new Error(error.message)

    Message.findByIdAndUpdate(
      messageInstance.id,
      { status: 'sent' },
      { new: true },
      err => {
        if (error) throw new Error(error.message)
      }
    )
  })
}
