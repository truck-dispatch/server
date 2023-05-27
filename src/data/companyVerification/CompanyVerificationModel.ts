import { model, Schema, Types } from 'mongoose'
import Company from '@interfaces/Company'

const schema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    cacReference: {
      type: String,
      required: true,
    },
    cacDocument: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export const CompanyVerificationModel = model<Company>(
  'CompanyVerification',
  schema
)
