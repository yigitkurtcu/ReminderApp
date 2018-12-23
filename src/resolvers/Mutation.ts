import bcrypt from 'bcryptjs'
import moment from 'moment'
import schedule from 'node-schedule'

import Message from '../models/Message'
import User from '../models/User'
import { sendMail } from '../util/mailService'
import { generateToken, getUserId } from '../util/tokenService'

const Mutation = {
  async setReminder(parent, { data }, { request }, info) {
    const userId = await getUserId(request)
    // Check that the date is not in the past
    if (data.date < moment().format()) throw new Error('Date is invalid')
    if (data.message.length < 5)
      throw new Error('Your message must be more than 5 letter')

    const user: any = await User.findOne({ _id: userId }, 'email')
    const userReminder = new Message({
      time: data.date,
      text: data.message,
      status: 'willSend',
      author: userId,
      email: user.email
    })
    await userReminder.save()

    schedule.scheduleJob(data.date, () => {
      Message.findOne({ _id: userReminder._id }).then((message: any) => {
        if (message.status !== 'canceled')
          // Send a reminder to user
          sendMail(
            `Your reminder message is '${data.message}'`,
            user.email,
            userReminder
          )
      })
    })
    return 'Your reminder has been successfully set.'
  },
  async cancelReminder(parent, { id }, { request }, info) {
    await Message.findByIdAndUpdate(id, { status: 'canceled' }, { new: true })
    return 'Your reminder successfully canceled.'
  },
  async register(parent, { data }, ctx, info) {
    const isExists = await User.findOne({ email: data.email })
    if (isExists) throw new Error('Email is exists')

    const password: string = await bcrypt.hash(data.password, 10)
    const user = new User({
      ...data,
      password
    })
    const newUser: any = await user.save()
    return {
      _id: newUser._id.toString(),
      email: newUser.email,
      fullName: newUser.fullName,
      password: newUser.password
    }
  },
  async login(parent, args, ctx, info) {
    const user: any = await User.findOne({ email: args.data.email })
    if (!user) throw new Error('Unable to login!')

    const isMatch = await bcrypt.compare(args.data.password, user.password)
    if (!isMatch) throw new Error('Unable to login!')

    return {
      token: generateToken(user.id),
      user: {
        _id: user._id.toString(),
        email: user.email,
        fullName: user.fullName
      }
    }
  }
}
export default Mutation
