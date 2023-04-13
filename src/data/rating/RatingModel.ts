import { model, Schema } from 'mongoose'
import Rating from '../../types/Rating'

const schema = new Schema(
  {
    tripId: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
    },
    /**The id of the user presently rating */
    userRating: {
      type: String,
      required: true,
    },
    /**The id of the user presently being rated */
    userRated: {
      type: String,
      required: true,
    },
    starRating: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export const RatingModel = model<Rating>('Rating', schema)
