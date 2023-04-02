import { model, Schema } from 'mongoose'
import User from '../../../types/User'

const schema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isEmailVerified: {
      type: Boolean,
    },
    isPhoneVerified: {
      type: Boolean,
    },
    status: {
      type: String,
    },
    rating: {
      type: Number,
    },
    avatar: {
      type: String,
    },
    bankDetails: {
      type: Object,
    },
    userType: {
      type: String,
      required: true,
    },
    completedTrips: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

export const UserModel = model<User>('User', schema)
