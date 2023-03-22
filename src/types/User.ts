import { userTypes } from '../common/constants'
import Asset from './Asset'
import BankAccount from './BankAccount'

export default interface User {
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
  bankAccount: BankAccount
  password: string
}
