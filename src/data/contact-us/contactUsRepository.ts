import MarketingMessage from '@interfaces/ContactUsMessage'

import { ContactUsModel } from './ContactUsModel'

export async function recordContactUsMessage(msg: MarketingMessage) {
  const data = new ContactUsModel(msg)

  return data.save();
}
