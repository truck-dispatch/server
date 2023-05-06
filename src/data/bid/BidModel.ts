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
      ownerId: {
        type: String,
        required: true,
      },
      plateNumber: {
        type: String,
        required: true,
      },
      vehicleType: {
        type: String,
        required: true,
      },
      images: {
        frontView: {
          type: String,
          required: true,
        },
        backView: {
          type: String,
          required: true,
        },
        leftSideView: {
          type: String,
          required: true,
        },
        rightSideView: {
          type: String,
          required: true,
        },
        driversCockPit: {
          type: String,
          required: true,
        },
        backInnerView: {
          type: String,
          required: true,
        },
      },
      driver: {
        name: {
          type: String,
          required: true,
        },
        phone: {
          type: String,
          required: true,
        },
        driverLicense: {
          type: String,
          required: true,
        },
        avatar: {
          type: String,
          required: true,
        },
      },
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
