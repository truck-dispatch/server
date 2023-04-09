import { model, Schema } from 'mongoose'
import ChatLogQuery from 'types/ChatLogQuery'

const schema = new Schema(
  {
    clientId: {
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

export const ChatLogModel = model<ChatLogQuery>('ChatLog', schema)
