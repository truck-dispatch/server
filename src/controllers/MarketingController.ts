import { NextFunction, Request, Response } from 'express'
import { recordMessage } from '@data/marketing/marketingRepository'
import Respond from '@helpers/Respond'

class MarketingController {
  async sendMessage(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, companyName, phone, message } = req.body

      // if (!name || !email || !phone || !message) return Respond.error(res, "name, email, phone and message are compulsory fields")

      const marketMessage = await recordMessage({
        name,
        email,
        companyName,
        message,
      })
      return Respond.success(
        res,
        'Your message has been recorded, we will get back to you shortly',
        marketMessage
      )
    } catch (err) {
      next(err)
    }
  }
}

export default new MarketingController()
