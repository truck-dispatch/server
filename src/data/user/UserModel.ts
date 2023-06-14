import { model, Schema } from 'mongoose'
import User from 'interfaces/User'

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
    companyVerificationStatus: {
      type: String,
    },
    rating: {
      type: Number,
      default: 5,
    },
    balance: {
      type: Number,
      default: 0,
    },
    ledgerBalance: {
      type: Number,
      default: 0,
    },
    completedTrips: {
      type: Number,
      default: 0,
    },
    noOfVehicles: {
      type: Number,
      default: 0,
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
    fromFirebase: {
      type: Boolean,
    },
    isSuspended: {
      type: Boolean,
    },
    roleInCompany: {
      type: String,
    },
    companyDetails: {
      type: Object,
    },
  },
  { timestamps: true }
)

export const UserModel = model<User>('User', schema)
