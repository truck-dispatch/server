import { NextFunction, Request, Response } from 'express'
import { findUserBy } from '../data/user/userRepository'
import { Helpers } from '../helpers'
import Respond from '../helpers/Respond'
import { compareHashAndPassword } from '../services/encrypt'
import Sms from '../services/Sms'

class AuthMiddlewares {
  async registrationCredentialChecks(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, password, phone, userType, firstName, lastName } = req.body
      const isValidEmail = Helpers.isValidEmail(email)
      if (!isValidEmail) {
        return Respond.error(res, 'Provide a valid email address', 400)
      }
      if (!phone || !password || !userType || !firstName || !lastName) {
        return Respond.error(
          res,
          'phone, password, userType, firstName, lastName are compulsory fields.',
          400
        )
      }
      const userWithEmailExists = await findUserBy({ email })
      const userWithPhoneExists = await findUserBy({
        phone: Helpers.convertPhone(phone),
      })

      if (!!userWithPhoneExists) {
        return Respond.error(
          res,
          'This phone number already exists on our database.',
          400
        )
      }
      if (!!userWithEmailExists) {
        return Respond.error(
          res,
          'This email already exists on our database.',
          400
        )
      }

      next()
    } catch (err) {
      // Report error to our client..
      console.log(err)
      Respond.error(res, 'Something went wrong...')
    }
  }

  async loginCredentialChecks(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body
      const isValidEmail = Helpers.isValidEmail(email)

      if (!isValidEmail)
        return Respond.error(res, 'Provide a valid email address')

      const user = await findUserBy({ email }, false)
      if (!user) {
        return Respond.error(
          res,
          'A user with this email does not exist in our database',
          400
        )
      }
      const passwordsMatch = await compareHashAndPassword(
        user.password,
        password
      )
      if (!passwordsMatch) {
        return Respond.error(res, 'Email and Password do not match', 400)
      }

      if (!user.isPhoneVerified) {
        const verificationData = await Sms.sendOTP({ to: user.phone })
        return Respond.error(
          res,
          'Phone has not been verified',
          401,
          verificationData
        )
      }

      next()
    } catch (err) {
      console.log(err)
      return Respond.error(res, `${err}`)
    }
  }

  async verifyPhoneChecks(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone, pin_id, pin } = req.body

      if (!pin) return Respond.error(res, 'Pin is a required field')
      if (!phone || !pin_id) {
        return Respond.error(
          res,
          'Something went wrong. Kindly request a new verification pin.'
        )
      }

      const userWithPhoneExists = await findUserBy({
        phone: Helpers.convertPhone(phone),
      })

      if (!userWithPhoneExists) {
        return Respond.error(
          res,
          'A user with this phone number does not exist.'
        )
      }

      next()
    } catch (err) {
      // Report error to our client..
      console.log(err)
      Respond.error(res, 'Something went wrong...', 500)
    }
  }
  async requestSMSChecks(req: Request, res: Response, next: NextFunction) {
    try {
      const { phone } = req.body

      if (!phone) {
        return Respond.error(res, 'A phone number is required to complete this')
      }
      const formattedPhone = Helpers.convertPhone(phone)
      const userWithPhoneExists = await findUserBy({
        phone: formattedPhone,
      })
      if (!userWithPhoneExists) {
        return Respond.error(
          res,
          'A user with this phone number does not exist.'
        )
      }

      next()
    } catch (err) {
      // Report error to our client..
      console.log(err, 'consoled err')
      Respond.error(res, 'Something went wrong...', 500)
    }
  }
}

export default new AuthMiddlewares()
