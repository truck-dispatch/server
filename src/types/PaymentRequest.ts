import { Vehicle } from './Vehicle'

export default interface PaymentRequest {
  vehicle: Vehicle
  proofVideo: string
  status: 'pending' | 'rejected' | 'completed'
  transporterId: string
  tripId: string
  tripReference: string
  paymentReference?: string
  reference: string
  amount: number
  agentRemark?: string
}
