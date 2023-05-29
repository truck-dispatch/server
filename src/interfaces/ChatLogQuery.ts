import { Types } from 'mongoose'

export default interface ChatLogQuery {
  client: string | Types.ObjectId
  transporter: string | Types.ObjectId
}
