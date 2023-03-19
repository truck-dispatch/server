import Asset from './Asset'

export default interface PaymentRequest {
  id: string
  driverName: string
  paystackRecipient: string
  driverPhoneNumber: string
  containerVideo: File | null | Asset
  status: 'pending' | 'rejected' | 'completed'
  transporterId: string
  tripId: string
  truckPlateNumber: string
  tripReference: string
  createdAt?: number
  updatedAt?: number
  paymentReference?: string
  reference?: string
  amount?: number
  agentRemark?: string
}
