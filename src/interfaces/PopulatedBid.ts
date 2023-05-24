import Trip from './Trip'
import Vehicle from './Vehicle'

export default interface PopulatedBid {
  _id: string
  paymentId?: string
  extraNotes?: string
  price: number
  presentLocation?: string
  transporter: string
  trip: Trip
  status: 'pending' | 'accepted' | 'rejected'
  vehicle: Vehicle
}
