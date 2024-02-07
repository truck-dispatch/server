import { MarketingModel } from './ContactUsModel'
import MarketingMessage from '@interfaces/ContactUsMessage'

export async function recordContactUsMessage(msg: MarketingMessage) {
  const data = new MarketingModel(msg)

  return data.save()
}
