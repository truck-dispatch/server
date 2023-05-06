import { model, Schema } from 'mongoose'
import Vehicle from '@interfaces/Vehicle'

const schema = new Schema(
  {
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
  { timestamps: true }
)

export const VehicleModel = model<Vehicle>('vehicle', schema)
