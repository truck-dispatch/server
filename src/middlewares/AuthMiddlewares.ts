import { NextFunction, Request, Response } from 'express'
import { decodeToken, generateJWT } from '@services/JWT'
import { findAndUpdateUserBy, findUserBy } from '@data/user/userRepository'
import { Helpers } from '@helpers/index'
import Respond from '@helpers/Respond'
import { compareHashAndPassword } from '@services/encrypt'
import Sms from '@services/Sms'
import Mail from '@services/Mail'
import { FRONTEND_URL } from '@common/privateKeys'
import { rolesInACompany, userTypes } from '@common/constants'

class AuthMiddlewares {
  async registrationCredentialChecks(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, phone, userType, firstName, lastName, roleInCompany } =
        req.body
      const isValidEmail = Helpers.isValidEmail(email.toLowerCase())
      if (!isValidEmail) {
        return Respond.error(res, 'Provide a valid email address', 400)
      }
      if (!userTypes.includes(userType))
        return Respond.error(res, 'This is not an accepted user type')
      if (!phone || !userType || !firstName || !lastName) {
        return Respond.error(
          res,
          'phone, userType, firstName, lastName are compulsory fields.',
          400
        )
      }

      if (roleInCompany && !rolesInACompany.includes(roleInCompany)) {
        return Respond.error(
          res,
          'The selected role is currently not supported.',
          400
        )
      }

      const userWithEmailExists = await findUserBy({
        email: email.toLowerCase(),
      })
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
      Respond.error(res, 'Something went wrong...')
    }
  }

  async loginCredentialChecks(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body
      const isValidEmail = Helpers.isValidEmail(email.toLowerCase())

      if (!isValidEmail)
        return Respond.error(res, 'Provide a valid email address')

      const user = await findUserBy({ email: email.toLowerCase() }, false)
      if (!user) {
        return Respond.error(
          res,
          'A user with this email does not exist in our database',
          400
        )
      }
      // TODO: remove this line of code when all users from firebase have migrated away from firebase.
      if (user.fromFirebase) {
        const token = generateJWT(
          { _id: user._id, userType: user.userType },
          '1d'
        )
        await Mail.portFromFirebase(
          user.email,
          `${FRONTEND_URL}/profile/manage-password?action=sign-in&token=${token}&isPhoneVerified=${user.isPhoneVerified}`
        )
        await findAndUpdateUserBy({ _id: user._id }, { isEmailVerified: true })
        return Respond.error(
          res,
          'Login directions have been sent to your email'
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

  async checkEmailVerification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const token = req.body.token
      if (!token) return Respond.error(res, 'Token was not passed.')
      const tokenDetails = decodeToken<{ _id: string; email: string }>(token)
      const user = await findUserBy({ _id: tokenDetails._id })

      if (!user) return Respond.error(res, 'User does not exist')

      next()
    } catch (err) {
      return Respond.error(res, (err as Error).message)
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
