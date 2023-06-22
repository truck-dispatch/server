import { Types } from 'mongoose'

export default interface ChatLogQuery {
  client?: string | Types.ObjectId
  transporter?: string | Types.ObjectId
  lastMessage?: string | Types.ObjectId
  _id?: string | Types.ObjectId
}
