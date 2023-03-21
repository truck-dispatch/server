import { model, Schema } from 'mongoose'
import User from '../../types/User'

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
    },
    phone: {
      type: String,
      required: true,
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
    bankAccount: {
      type: Object,
    },
  },
  { timestamps: true }
)

export const UserSchema = model<User>('User', schema)
