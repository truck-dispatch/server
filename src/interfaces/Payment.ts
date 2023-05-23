export default interface Payment {
  from: string
  to: string
  trip: string
  bid: string
  paymentReference: string
  amountInBid: number
  totalAmountPaid: number
  status: 'success' | 'rejected'
  transaction: string
  tripReference: string
}
