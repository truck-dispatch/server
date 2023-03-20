import { Document } from 'mongoose'
export default interface Chat extends Document {
  chatId: string
  message: string
  senderId: string
  receiverId: string
  agentId: string
  transporterId: string
  status?: 'success' | 'pending' | 'failed'
  readAt?: number
}
