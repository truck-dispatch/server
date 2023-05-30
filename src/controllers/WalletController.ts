import { createPayment } from '@data/payment/paymentRepository'
import { creditUser, creditUserLedgerBalance } from '@data/user/userRepository'
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
      const { amount, totalAmount, paymentReference, transaction } = req.body
      const user = getUserCredentialsFromReq(req)

      const [_createdPayment, _creditedUser, updatedUser] = await Promise.all([
        createPayment({
          from: user._id,
          to: user._id,
          trip: '',
          type: 'topUp',
          amount,
          totalAmount,
          paymentReference,
          transaction,
          status: 'success',
        }),
        creditUser(user._id, amount),
        creditUserLedgerBalance(user._id, amount),
      ])

      return Respond.success(res, 'Wallet updated', updatedUser)
    } catch (err) {
      next(err)
    }
  }
}

export default new WalletController()
