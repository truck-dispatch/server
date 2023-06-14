import { Document, Types } from 'mongoose'
export default interface Chat extends Document {
  chatLog: string | Types.ObjectId
  message: string
  sender: string | Types.ObjectId
  receiver: string | Types.ObjectId
  readAt?: number
}
