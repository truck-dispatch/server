import { createPaymentLog } from '@data/paymentLog/paymentLogRepository'
import { createTransaction } from '@data/transaction/transactionRepository'
import {
  creditUser,
  creditUserEscrowBalance,
  debitUser,
  findUserBy,
} from '@data/user/userRepository'
import { Helpers } from '@helpers/index'
import Respond from '@helpers/Respond'
import ApiError from '@interfaces/ApiError'
import { getUserCredentialsFromReq } from '@services/JWT'
import Paystack from '@services/Paystack'
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
      const { amount, totalAmountPaid, reference, transaction } = req.body
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
      const { _id } = getUserCredentialsFromReq(req)

      if (!amount) {
        return Respond.error(res, 'Amount was not provided')
      }
      const user = await findUserBy({ _id })

      if (!user?.bankDetails)
        return Respond.error(
          res,
          'User bank details does not exist. Input bank details to proceed..'
        )

      if ((user?.balance || 0) < Number(amount)) {
        return Respond.error(res, 'Insufficient funds', 400)
      }

      const transferData = {
        source: 'balance',
        reason: 'TruckDispatch wallet payout payment',
        reference: Helpers.generateReference(),
        recipient: user.bankDetails.paystackRecipientCode,
        amount: Helpers.nairaToKobo(Number(amount)),
      }

      await Paystack.makeTransfer(transferData).catch((err: ApiError) => {
        throw new Error(err.response?.data?.message)
      })

      const debittedUser = await debitUser(user._id, Number(amount))
      // TODO: send mail here.

      return Respond.success(res, "Your money is on it's way", debittedUser)
    } catch (err) {
      next(err)
    }
  }
}

export default new WalletController()
