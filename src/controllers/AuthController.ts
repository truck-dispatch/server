import { NextFunction, Request, Response } from 'express'
import {
  createUser,
  findAndUpdateUserBy,
  findUserBy,
} from '../data/models/User/user.repository'
import { Helpers } from '../helpers'
import Respond from '../helpers/Respond'
import { encrypt } from '../services/encrypt'
import { generateJWT } from '../services/JWT'
import Sms from '../services/Sms'
import User from '../types/User'

class AuthController {
  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        email,
        password,
        phone,
        userType,
        firstName,
        lastName,
        status,
      }: Record<string, string> = req.body
      const encryptedPassword = await encrypt(password)
      const formattedPhone = Helpers.convertPhone(phone)

      const data = {
        email: email.toLowerCase(),
        password: encryptedPassword,
        phone: formattedPhone,
        userType,
        firstName,
        lastName,
        isEmailVerified: false,
        isPhoneVerified: false,
      } as User

      if (status) data.status = status as User['status']
      await createUser(data)
      const smsData = await Sms.sendOTP({
        to: formattedPhone,
      })
      return Respond.success(res, 'User created successfully...', smsData)
    } catch (err) {
      next(err)
    }
  }

  async loginUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body

      const user = await findUserBy({ email: email.toLowerCase() })
      if (!user) return Respond.error(res, 'user does not exist')
      const jwt = generateJWT(user)

      return Respond.success(res, 'Login successful', { jwt })
    } catch (err) {
      next(err)
    }
  }

  async requestSmsVerificationCode(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { phone } = req.body
      const smsData = await Sms.sendOTP({ to: phone })
      return Respond.success(res, 'SMS sent successfully...', smsData)
    } catch (err) {
      next(err)
    }
  }

  async verifyPhoneNumber(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone, pin, pin_id } = req.body
      await Sms.verifyOTP(pin_id, pin).catch((err) => {
        return Respond.error(res, err.response.data.message)
      })

      await findAndUpdateUserBy(
        { phone: Helpers.convertPhone(phone) },
        { isPhoneVerified: true }
      )
      return Respond.success(res, 'Phone number verification complete')
    } catch (err) {
      next(err)
    }
  }
}

export default new AuthController()
