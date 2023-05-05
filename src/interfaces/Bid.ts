import Vehicle from './Vehicle'

export default interface Bid {
  _id: string
  paymentId?: string
  extraNotes?: string
  price: number
  presentLocation?: string
  transporterId: string
  driverName: string
  tripId: string
  status: 'pending' | 'accepted' | 'rejected'
  vehicle: Vehicle
}
