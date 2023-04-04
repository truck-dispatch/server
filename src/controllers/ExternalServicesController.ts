import { NextFunction, Request, Response } from 'express'
import Respond from '../helpers/Respond'
import Paystack from '../services/Paystack'

class ExternalServicesController {
  async loadBanks(_: Request, res: Response, next: NextFunction) {
    try {
      const data = await Paystack.loadBanks()
      return Respond.success(res, 'Banks successfully fetched', data)
    } catch (e) {
      next(e)
    }
  }

  async loadAccountDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const bankCode = req.query.bank_code
      const accountNumber = req.query.account_number
      if (!bankCode) return Respond.error(res, 'Bankcode was not provided')
      if (!accountNumber)
        return Respond.error(res, 'account_number was not provided')

      const accountDetails = await Paystack.loadAccountDetails(
        `${bankCode}`,
        `${accountNumber}`
      )
      return Respond.success(
        res,
        'Account details successfully fetched',
        accountDetails
      )
    } catch (err) {
      const errAsAny = err as any
      if (errAsAny.response.data.message) {
        return Respond.error(res, errAsAny.response.data.message)
      }
      next(err)
    }
  }
}

export default new ExternalServicesController()
