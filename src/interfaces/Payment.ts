import { Types } from 'mongoose'

export default interface Payment {
  from: string | Types.ObjectId
  to: string | Types.ObjectId
  trip?: string
  type: 'topUp' | 'payment'
  bid?: string
  processorReference: string
  amount: number
  totalAmount: number
  status: 'success' | 'rejected'
  transaction: string
  tripReference?: string
}
