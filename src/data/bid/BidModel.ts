import { model, Schema, Types } from 'mongoose'
import Bid from 'interfaces/Bid'

const schema = new Schema(
  {
    paymentId: {
      type: String,
    },
    extraNotes: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    presentLocation: {
      type: String,
      required: true,
    },
    transporter: {
      type: Types.ObjectId,
      required: true,
      ref: 'User'
    },
    vehicle: {
      type: Object,
      required: true,
    },
    trip: {
      type: Types.ObjectId,
      required: true,
      ref: 'Trip'
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export const BidModel = model<Bid>('Bid', schema)
