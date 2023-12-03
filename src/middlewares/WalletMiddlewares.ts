import Respond from '@helpers/Respond'
import { Request, Response, NextFunction } from 'express'

class WalletMiddlewares {
  allDataToTopupIsAvailable(req: Request, res: Response, next: NextFunction) {
    try {
      const { totalAmountPaid, amount, transaction, reference } =
        req.body
        

      if (!totalAmountPaid || !amount || !transaction || !reference)
        return Respond.error(
          res,
          'Transaction data is incomplete. Reach out to support for more assistance'
        )

      next()
    } catch (e) {
      return Respond.error(res, 'Something went wrong...', 500)
    }
  }
}

export default new WalletMiddlewares()
