import { model, Schema, Document } from 'mongoose'

export interface Chat extends Document {
  senderId: string
  receiverId: string
  message: string
  chatId: string
  agentId: string
  transporterId: string
}

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
  },
  { timestamps: true }
)

export const ChatSchema = model<Chat>('Chat', schema)
