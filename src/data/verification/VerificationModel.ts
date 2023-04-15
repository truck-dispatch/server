import { model, Schema } from 'mongoose'
import Verification from 'interfaces/Verification'

const schema = new Schema(
  {
    idType: {
      type: String,
      required: true,
    },
    idDoc: {
      type: String,
      required: true,
    },
    homeAddress: {
      type: String,
      required: true,
    },
    homeUtilityBill: {
      type: String,
      required: true,
    },
    garageAddress: {
      type: String,
      required: true,
    },
    officeAddress: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: false,
    },
    guarantor: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      homeAddress: {
        type: String,
        required: true,
      },
      idType: {
        type: String,
        required: true,
      },
      idDoc: {
        type: String,
        required: true,
      },
    },
    adminMessage: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
)

export const VerificationModel = model<Verification>('Verification', schema)
