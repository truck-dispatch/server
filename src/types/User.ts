import { userTypes } from '../common/constants'
import Asset from './Asset'
import BankDetails from './BankDetails'

export default interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar?: Asset | File
  userType: (typeof userTypes)[number]
  status?:
    | 'pending_verification'
    | 'verified'
    | 'unverified'
    | 'rejected'
    | 'fraudulent'
  rating: number
  bankDetails: BankDetails
  password: string
  isEmailVerified: boolean
  isPhoneVerified: boolean
}
