import Message from '../models/Message'
import { getUserId } from '../util/tokenService'
const Query = {
  async getMyReminders(parent, args, { request }, info) {
    const userId = await getUserId(request)
    const messages = await Message.find({ author: userId })
    return messages
  }
}
export default Query
