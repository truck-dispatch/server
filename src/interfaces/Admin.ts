import { Types } from 'mongoose'

export default interface Admin {
  _id: string | Types.ObjectId
  firstName: string
  lastName: string
  role: 'super-admin' | 'support' | 'marketer'
  email: string
  password: string
}
