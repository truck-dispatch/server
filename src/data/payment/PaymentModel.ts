import { model, Schema } from 'mongoose'
import Payment from '../../types/Payment'

const schema = new Schema(
  {
    from: {
      type: String,
      required: true,
    },
    to: {
      type: String,
      required: true,
    },
    tripId: {
      type: String,
      required: true,
    },
    bidId: {
      type: String,
      required: true,
    },
    paymentReference: {
      type: String,
      required: true,
    },
    transaction: {
      type: String,
      required: true,
    },
    amountInBid: {
      type: Number,
      required: true,
    },
    totalAmountPaid: {
      type: Number,
      required: true,
    },
    tripReference: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export const PaymentModel = model<Payment>('Payment', schema)
