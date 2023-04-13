import { NextFunction, Request, Response } from 'express'
import { Helpers } from '../../helpers'
import Respond from '../../helpers/Respond'
import { findAdminBy } from '../../data/Admin/adminRepository'
import { compareHashAndPassword } from '../../services/encrypt'

class AuthMiddlewares {
  async registrationCredentialsChecks(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { email, firstName, lastName, password } = req.body
      const isValidEmail = Helpers.isValidEmail(email)
      if (!isValidEmail) {
        return Respond.error(res, 'Provide a valid email address', 400)
      }
      if (!email || !firstName || !lastName || !password) {
        return Respond.error(
          res,
          'firstName, lastName, email, password  are compulsory fields.',
          400
        )
      }
      const adminWithEmailExists = await findAdminBy({ email })
      if (!!adminWithEmailExists) {
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

      const admin = await findAdminBy({ email }, false)
      if (!admin) {
        return Respond.error(
          res,
          'Admin with this email does not exist in our database',
          400
        )
      }
      const passwordsMatch = await compareHashAndPassword(
        admin.password,
        password
      )
      if (!passwordsMatch) {
        return Respond.error(res, 'Email and Password do not match', 400)
      }

      next()
    } catch (err) {
      console.log(err)
      return Respond.error(res, `${err}`)
    }
  }
}

export default new AuthMiddlewares()
