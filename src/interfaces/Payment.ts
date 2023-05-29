import { Types } from 'mongoose'

export default interface Payment {
  from: string | Types.ObjectId
  to: string | Types.ObjectId
  trip: string
  bid: string
  paymentReference: string
  amountInBid: number
  totalAmountPaid: number
  status: 'success' | 'rejected'
  transaction: string
  tripReference: string
}
