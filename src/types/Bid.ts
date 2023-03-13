export default interface Bid {
  id: string;
  paymentId?: string;
  extraNotes?: string;
  price: number;
  presentLocation?: string;
  transporterId: string;
  driverName: string;
  truckPlateNumber: string;
  tripId: string;
  status: 'pending' | 'accepted' | 'rejected';
}
