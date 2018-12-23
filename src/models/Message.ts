import mongoose from 'mongoose'

const messageSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['willSend', 'sent', 'canceled'],
    default: 'willSend'
  }
})

export default mongoose.model('messages', messageSchema)
