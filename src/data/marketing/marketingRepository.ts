import { MarketingModel } from './MarketingModel'
import MarketingMessage from '@interfaces/MarketingMessage'

export async function recordMessage(msg: MarketingMessage) {
  const data = new MarketingModel(msg)
  await data.save()
  return data
}
