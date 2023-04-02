import { NextFunction, Request, Response } from 'express'
import Respond from '../helpers/Respond'

class UserMiddlewares {
  checkBankAccountDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, account_number, bank_code, bank_name } = req.body
      if (!name || !account_number || !bank_code || !bank_name) {
        return Respond.error(
          res,
          ' name, account_number, bank_code, bank_name are compulsory fields'
        )
      }

      next()
    } catch (err) {
      return Respond.error(res, (err as Error).message)
    }
  }
}

export default new UserMiddlewares()
