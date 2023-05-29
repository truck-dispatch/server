import { Types } from 'mongoose'

export default interface Verification {
  _id: string | Types.ObjectId
  idType: string
  idDoc: string
  homeAddress: string
  homeUtilityBill: string
  garageAddress: string
  officeAddress: string
  user: string | Types.ObjectId
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
