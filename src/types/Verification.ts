import Asset from './Asset';

export default interface Verification {
  idType: string;
  idDoc: File | null | Asset;
  homeAddress: string;
  homeUtilityBill: File | null | Asset;
  garageAddress: string;
  officeAddress: string;
  userId: string;
  response?: string;
  guarantor: {
    name: string;
    email: string;
    phone: string;
    homeAddress: string;
    idType: string;
    idDoc: File | null | Asset;
  };
  adminMessage?: string;
}
