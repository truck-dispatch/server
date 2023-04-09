import { NextFunction, Request, Response } from 'express'
import { Helpers } from '../../helpers'
import Respond from '../../helpers/Respond'
import { findAdminBy } from '../../data/models/Admin/admin.repository'

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
}

export default new AuthMiddlewares()
