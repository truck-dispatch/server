import { NextFunction, Request, Response } from 'express'
import { encrypt } from '@services/encrypt'
import {
  findAndUpdateUserBy,
  findUserBy,
  updateUserBankDetails,
} from '@data/user/userRepository'
import { Helpers } from '@helpers/index'
import Respond from '@helpers/Respond'
import Cloudinary from '@services/Cloudinary'
import { getUserCredentialsFromReq } from '@services/JWT'
import Paystack from '@services/Paystack'
import User from 'interfaces/User'
import { findRatingsBy } from '@data/rating/ratingRepository'
import { serviceBasedUserTypes } from '@common/constants'
import { findVehiclesBy } from '@data/vehicle/vehicleRepository'

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

  async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id } = getUserCredentialsFromReq(req)

      const { password } = req.body
      const decodedPassword = await encrypt(password)

      const updatedUser = await findAndUpdateUserBy(
        { _id },
        { password: decodedPassword, fromFirebase: false }
      )
      return Respond.success(res, 'Password has been updated', updatedUser)
    } catch (err) {
      next(err)
    }
  }

  async getUserProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params
      if (!userId) return Respond.error(res, 'userId was not passed')
      const user = await findUserBy({ _id: userId })
      if (!user) return Respond.error(res, 'user was not found')
      const reviews = await findRatingsBy({ userRated: userId })
      const responseData = { ...user, reviews, vehicles: [] as unknown[] }

      if (serviceBasedUserTypes.includes(user?.userType!)) {
        const { data } = await findVehiclesBy({ owner: userId })
        responseData.vehicles = data
      }
      return Respond.success(res, 'user profile fetched', responseData)
    } catch (err) {
      next(err)
    }
  }
}

export default new UserController()
