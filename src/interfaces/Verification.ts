export default interface Verification {
  _id: string
  idType: string
  idDoc: string
  homeAddress: string
  homeUtilityBill: string
  garageAddress: string
  officeAddress: string
  user: string
  guarantor: {
    name: string
    email: string
    phone: string
    homeAddress: string
    idType: string
    idDoc: string
  }
  adminMessage?: string
}
