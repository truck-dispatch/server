import { NextFunction, Request, Response } from 'express'
import {
  findAndUpdateUserBy,
  findUserBy,
} from '../data/models/User/user.repository'
import Respond from '../helpers/Respond'
import { getUserFromReq } from '../services/JWT'

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

  async addAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        type,
        name,
        account_number,
        bank_code,
        currency,
        bank_name,
        paystackRecipientCode,
        paystackRecipientId,
      } = req.body
      const user = getUserFromReq(req)
      const userResponse = await findAndUpdateUserBy(
        { _id: user._id },
        {
          bankDetails: {
            type,
            name,
            account_number,
            bank_code,
            currency,
            bank_name,
            paystackRecipientCode,
            paystackRecipientId,
          },
        }
      )
      return Respond.success(res, 'Your Account Has Been Sucessfully Updated', userResponse)
    } catch (err) {
      next(err)
    }
  }
}

export default new UserController()
