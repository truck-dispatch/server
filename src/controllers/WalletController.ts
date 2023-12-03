import { createPaymentLog } from '@data/paymentLog/paymentLogRepository'
import { createTransaction } from '@data/transaction/transactionRepository'
import { creditUser, creditUserEscrowBalance } from '@data/user/userRepository'
import Respond from '@helpers/Respond'
import { getUserCredentialsFromReq } from '@services/JWT'
import { NextFunction, Request, Response } from 'express'

class WalletController {
  /**
   * directly tops up the balance of a user.
   * @param req
   * @param res
   * @param next
   */
  async topUpWallet(req: Request, res: Response, next: NextFunction) {
    try {
      const { amount, totalAmountPaid, reference, transaction } =
        req.body
      const user = getUserCredentialsFromReq(req)

      const [_, _trans, creditedUser] = await Promise.all([
        createPaymentLog({
          from: user._id,
          to: user._id,
          type: 'topUp',
          amount,
          totalAmount: totalAmountPaid,
          processorReference: reference,
          transaction,
          status: 'success',
        }),
        createTransaction({
          userId: user?._id!,
          type: 'credit',
          amount,
          totalAmount: totalAmountPaid,
          processorReference: reference,
          transaction,
        }),
        creditUser(user._id, amount),
      ])

      return Respond.success(res, 'Wallet updated', creditedUser)
    } catch (err) {
      next(err)
    }
  }
  async withdrawToAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { amount } = req.body
    } catch (err) {
      next(err)
    }
  }
}

export default new WalletController()
