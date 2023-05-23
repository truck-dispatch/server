import { Document } from 'mongoose'
export default interface Chat extends Document {
  chatLog: string
  message: string
  sender: string
  receiver: string
  readAt?: number
}
