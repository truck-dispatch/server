import { NextFunction, Request, Response } from 'express'
import {
  findAndUpdateUserBy,
  findUserBy,
  updateUserBankDetails,
} from '../data/models/User/UserRepository'
import Respond from '../helpers/Respond'
import { getUserFromReq } from '../services/JWT'
import Paystack from '../services/Paystack'

class UserController {
  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id } = getUserFromReq(req)
      const user = await findUserBy({ _id })

      if (!user) return Respond.error(res, 'Profile not found')

      return Respond.success(res, 'User profile has been fetched', user)
    } catch (err) {
      next(err)
    }
  }

  async addBankAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, account_number, bank_code, bank_name } = req.body
      const { _id } = getUserFromReq(req)
      const updatedUser = await updateUserBankDetails(
        { _id },
        { name, account_number, bank_code, bank_name }
      )
      return Respond.success(
        res,
        'Your Account Has Been Sucessfully Updated',
        updatedUser
      )
    } catch (err) {
      next(err)
    }
  }

  async updateBankAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, account_number, bank_code, bank_name } = req.body
      const { _id } = getUserFromReq(req)

      const user = await findUserBy({ _id })

      await Paystack.deleteTransferRecipient(
        user?.bankDetails.paystackRecipientId!
      )
      const updatedUser = await updateUserBankDetails(
        { _id },
        { name, account_number, bank_code, bank_name }
      )
      return Respond.success(
        res,
        'Your Account Has Been Sucessfully Updated',
        updatedUser
      )
    } catch (err) {
      next(err)
    }
  }
}

export default new UserController()
