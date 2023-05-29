import { Types } from 'mongoose'

export default interface Company {
  user?: string | Types.ObjectId
  name: string
  location: string
  cacDocument: string
  cacReference: string
}
