import { model, Schema, Types } from 'mongoose'
import Payment from 'interfaces/Payment'

const schema = new Schema(
  {
    from: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
    to: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
    trip: {
      type: Types.ObjectId,
      ref: 'Trip',
    },
    bid: {
      type: Types.ObjectId,
      ref: 'Bid',
    },
    processorReference: {
      type: String,
      required: true,
    },
    transaction: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
    },
    tripReference: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export const PaymentLogModel = model<Payment>('Payment', schema)
