import { Types } from 'mongoose'
import { userTypes } from '../common/constants'
import Company from './Company'
import TransferRecipient from './TransferRecipient'

type Status =
  | 'pending_verification'
  | 'verified'
  | 'unverified'
  | 'rejected'
  | 'fraudulent'
export default interface User {
  _id: string | Types.ObjectId
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar?: string
  balance?: number
  ledgerBalance?: number
  completedTrips?: number
  userType: (typeof userTypes)[number]
  status?: Status
  companyVerificationStatus: Status
  rating: number
  bankDetails: TransferRecipient
  password: string
  isEmailVerified: boolean
  isPhoneVerified: boolean
  fromFirebase: boolean
  isSuspended: boolean
  roleInCompany: string
  companyDetails: Company
}
