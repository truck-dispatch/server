import Mongoose, { model, Schema } from 'mongoose'
import MarketingMessage from '@interfaces/MarketingMessage'

const schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  companyName: {
    type: String,
  },
  message: {
    type: String,
    required: true,
  },
})
export const MarketingModel = model<MarketingMessage>('Marketing', schema)
