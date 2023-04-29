import { model, Schema } from 'mongoose'
import Company from '@interfaces/Company'

const schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
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
