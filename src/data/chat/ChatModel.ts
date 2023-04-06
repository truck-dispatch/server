import { model, Schema } from 'mongoose'
import Chat from '../../types/Chat'

const schema = new Schema(
  {
    chatId: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },
    agentId: {
      type: String,
      required: true,
    },
    transporterId: {
      type: String,
      required: true,
    },
    readAt: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
)

export const ChatModel = model<Chat>('Chat', schema)
