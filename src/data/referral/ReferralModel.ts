import Mongoose, { model, Schema } from 'mongoose'
import Referral from '@interfaces/Referral'

const schema = new Schema(
  {
    referrer: {
      required: true,
      type: Mongoose.Types.ObjectId,
      ref: 'User',
    },
    referred: {
      required: true,
      type: Mongoose.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      required: true,
    },
    commission: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
)

export const ReferralModel = model<Referral>('Referral', schema)
