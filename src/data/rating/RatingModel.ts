import { model, Schema, Types } from 'mongoose'
import Rating from 'interfaces/Rating'

const schema = new Schema(
  {
    trip: {
      type: Types.ObjectId,
      required: true,
      ref: 'Trip',
    },
    comment: {
      type: String,
    },
    /**The id of the user presently rating */
    userRating: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
    /**The id of the user presently being rated */
    userRated: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
    starRating: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export const RatingModel = model<Rating>('Rating', schema)
