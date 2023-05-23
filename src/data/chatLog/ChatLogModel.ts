import { model, Schema, Types } from 'mongoose'
import ChatLogQuery from 'interfaces/ChatLogQuery'

const schema = new Schema(
  {
    client: {
      type: Types.ObjectId,
      required: true,
      ref: 'User'
    },
    transporter: {
      type: Types.ObjectId,
      required: true,
      ref: 'User'
    },
  },
  { timestamps: true }
)

export const ChatLogModel = model<ChatLogQuery>('ChatLog', schema)
