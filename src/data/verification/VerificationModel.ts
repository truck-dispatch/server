import { model, Schema, Types } from 'mongoose'
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
    user: {
      type: Types.ObjectId,
      required: true,
      ref: 'User',
    },
    facialPicture: {
      type: String,
      required: true,
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
    // Reason for reject.
    adminMessage: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
)

export const VerificationModel = model<Verification>('Verification', schema)
