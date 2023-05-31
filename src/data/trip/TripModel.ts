import Mongoose, { model, Schema } from 'mongoose'
import PopulatedTrip from '@interfaces/PopulatedTrip'

const schema = new Schema(
  {
    tripOwner: {
      required: true,
      type: Mongoose.Types.ObjectId,
      ref: 'User',
    },
    tripOwnerUserType: {
      required: true,
      type: String,
    },
    transporter: {
      type: Mongoose.Types.ObjectId,
      ref: 'User',
    },
    paymentRequest: {
      type: Mongoose.Types.ObjectId,
      ref: 'PaymentRequest',
    },
    pickUpAddress: {
      type: String,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    pickUpDate: {
      type: String,
      required: true,
    },
    deliveryDate: {
      type: String,
      required: true,
    },
    typeOfGoods: {
      type: String,
      required: true,
    },
    weight: {
      type: String,
      required: true,
    },
    sizeOfContainer: {
      type: String,
    },
    shippingLine: {
      type: String,
    },
    jobType: {
      type: String,
    },
    instructions: {
      type: String,
    },
    TDO: {
      type: String,
    },
    reference: {
      type: String,
    },
    startTime: {
      type: String,
    },
    completionTime: {
      type: String,
    },
    status: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
)

export const TripModel = model<PopulatedTrip>('Trip', schema)
