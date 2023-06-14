import { model, Schema, Types } from 'mongoose'
import Chat from 'interfaces/Chat'

const schema = new Schema(
  {
    chatLog: {
      type: Types.ObjectId,
      required: true,
      ref: 'ChatLog',
    },
    message: {
      type: String,
      required: true,
    },
    sender: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
    receiver: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
    readAt: {
      type: Number,
      required: false,
    },
  },
  { timestamps: true }
)

export const ChatModel = model<Chat>('Chat', schema)
