import { Types } from 'mongoose'

export default interface Referral {
  referrer: string | Types.ObjectId
  referred: string | Types.ObjectId
  commission: number
  status: 'pending' | 'completed'
}
