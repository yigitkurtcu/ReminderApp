import moment from 'moment'
import schedule from 'node-schedule'
import Message from '../models/Message'
import { sendMail } from '../util/mailService'

export const checkReminders = async () => {
  const messages: any = await Message.find({ status: 'willSend' })
  messages.forEach(message => {
    // Send mail for out-of-date reminders
    if (message.time < moment().format()) {
      // tslint:disable-next-line:max-line-length
      const mailText: string = `We could not remind your message in a timely manner because of a technical failure.<br>Your message is '${
        message.text
      }' and your remind time '${message.time}'`
      sendMail(mailText, message.email, message)
    } else {
      // Set reminders again for active ones
      schedule.scheduleJob(message.time, () => {
        // Send a reminder to user
        sendMail(
          `Your reminder message is '${message.text}'`,
          message.email,
          message
        )
      })
    }
  })
}
