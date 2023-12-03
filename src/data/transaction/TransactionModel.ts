import { model, Schema, Types } from 'mongoose'
import Transaction from '@interfaces/Transaction'

const schema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
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
    type: {
        type: String,
        required: true
    }
  },
  { timestamps: true }
)

export const TransactionModel = model<Transaction>('Transaction', schema)
