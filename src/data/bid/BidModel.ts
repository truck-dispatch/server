import { model, Schema } from 'mongoose'
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
    transporterId: {
      type: String,
      required: true,
    },
    vehicle: {
      type: Object,
      required: true,
    },
    tripId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export const BidModel = model<Bid>('Bid', schema)
