import { Types } from 'mongoose'

export default interface Rating {
  _id: string | Types.ObjectId
  trip: string | Types.ObjectId
  comment: string
  /**The id of the user presently rating */
  userRating: string | Types.ObjectId
  /**The id of the user presently being rated */
  userRated: string | Types.ObjectId
  starRating: number
}
