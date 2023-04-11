import { NextFunction, Request, Response } from 'express'
import {
  findAndUpdateUserBy,
  findUserBy,
  updateUserBankDetails,
} from '../data/user/userRepository'
import { Helpers } from '../helpers'
import Respond from '../helpers/Respond'
import Cloudinary, { UploadParams } from '../services/Cloudinary'
import { getUserCredentialsFromReq } from '../services/JWT'
import Paystack from '../services/Paystack'
import User from '../types/User'

class UserController {
  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id } = getUserCredentialsFromReq(req)
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
      const { _id } = getUserCredentialsFromReq(req)
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
      const { _id } = getUserCredentialsFromReq(req)

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

  async updateUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { firstName, lastName } = req.body
      const { _id } = getUserCredentialsFromReq(req)
      const avatar = Helpers.extractFileFromReq(req, 'avatar')
      const data: Partial<User> = {}
      let avatarUrl: string
      if (firstName) data.firstName = firstName
      if (lastName) data.lastName = lastName
      if (avatar) {
        const user = await findUserBy({ _id })
        avatarUrl = await Cloudinary.upload({ file: avatar }, user?.avatar)
        data.avatar = avatarUrl
      }

      const updatedUser = await findAndUpdateUserBy({ _id }, data)
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
