export default interface Payment {
  userId: string;
  id: string;
  tripId?: string;
  bidId?: string;
  reference: string;
  status: 'success';
  trans: string;
  transaction: string;
  trxref: string;
  tripReference: string;
  amountInBid: number;
  totalAmountPaid: number;
}
