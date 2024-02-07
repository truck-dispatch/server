import Mongoose, { model, Schema } from 'mongoose'
import GetHelpData from '@interfaces/GetHelpData'

const schema = new Schema({
  reportedTripId: {
    required: true,
    type: Mongoose.Types.ObjectId,
    ref: 'Trip',
  },
  reporterId: {
    required: true,
    type: Mongoose.Types.ObjectId,
    ref: 'User',
  },
  reportedId: {
    required: true,
    type: Mongoose.Types.ObjectId,
    ref: 'User',
  },
  complaint: {
    required: true,
    type: String,
  },
  resolved: {
    required: true,
    type: Boolean,
    default: false,
  },
})

export const GetHelpModel = model<GetHelpData>('GetHelp', schema)
