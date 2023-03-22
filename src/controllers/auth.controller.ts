import { NextFunction, Request, Response } from 'express'
import { createUser } from '../data/models/User/user.repository'
import Respond from '../helpers/Respond'
import { encrypt } from '../services/encrypt'

class AuthController {
  async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, phone, userType, firstName, lastName } = req.body

      const encryptedPassword = await encrypt(password);

      await createUser({
        email,
        password: encryptedPassword,
        phone,
        userType,
        firstName,
        lastName,
      })

      return Respond.success(res, 'User created successfully...');
    } catch (err) {
      next(err)
    }
  }
}

export default new AuthController()
