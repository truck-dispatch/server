import { Types } from 'mongoose'
import Vehicle from './Vehicle'

export default interface PaymentRequest {
  _id?: string | Types.ObjectId
  vehicle: Vehicle
  proofVideo: string
  status: 'pending' | 'rejected' | 'completed'
  transporter: string | Types.ObjectId
  trip: string | Types.ObjectId
  tripReference: string
  paymentReference: string
  reference: string
  amount: number
  reasonForReject?: string
}
