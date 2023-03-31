export default interface Payment {
  from: string;
  to: string
  tripId: string
  bidId: string
  paymentReference: string
  amountInBid: number
  totalAmountPaid: number
  status: 'success' | 'rejected'
  transaction: string
  tripReference: string
}
