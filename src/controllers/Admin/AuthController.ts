import { NextFunction, Request, Response } from 'express'
import { encrypt } from '../../services/encrypt'
import Admin from '../../types/Admin'
import Respond from '../../helpers/Respond'
import { createAdmin } from '../../data/models/Admin/admin.repository'

class AuthController {
  async registerAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, firstName, lastName, password } = req.body
      const encryptedPassword = await encrypt(password)
      const data = {
        email: email.toLowerCase(),
        firstName,
        lastName,
        password: encryptedPassword,
      } as Admin
      createAdmin(data)
      return Respond.success(res, 'Admin created successfully')
    } catch (err) {
      next(err)
    }
  }
}

export default new AuthController()
