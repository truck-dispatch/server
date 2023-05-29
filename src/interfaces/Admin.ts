import { Types } from 'mongoose'

export default interface Admin {
  _id: string | Types.ObjectId
  firstName: string
  lastName: string
  email: string
  password: string
}
