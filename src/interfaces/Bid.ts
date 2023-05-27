import { Types } from 'mongoose'
import Trip from './Trip'
import Vehicle from './Vehicle'

export default interface Bid {
  _id: string | Types.ObjectId
  paymentId?: string
  extraNotes?: string
  price: number
  presentLocation?: string
  transporter: string | Types.ObjectId
  trip: string | Types.ObjectId
  status: 'pending' | 'accepted' | 'rejected'
  vehicle: Vehicle
}
