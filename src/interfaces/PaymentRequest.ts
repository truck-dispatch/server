import Vehicle from './Vehicle'

export default interface PaymentRequest {
  _id?: string
  vehicle: Vehicle
  proofVideo: string
  status: 'pending' | 'rejected' | 'completed'
  transporter: string
  tripId: string
  tripReference: string
  paymentReference?: string
  reference: string
  amount: number
  reasonForReject?: string
}
