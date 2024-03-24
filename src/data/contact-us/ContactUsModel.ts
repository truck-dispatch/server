import { model, Schema } from 'mongoose'
import ContactUsMessage from '@interfaces/ContactUsMessage'

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

export const ContactUsModel = model<ContactUsMessage>('ContactUsMessage', schema)
