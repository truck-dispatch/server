import { NextFunction, Request, Response } from 'express'
import { encrypt } from '@services/encrypt'
import Admin from 'interfaces/Admin'
import Respond from '@helpers/Respond'
import { createAdmin, findAdminBy } from '@data/Admin/adminRepository'
import { generateJWT } from '@services/JWT'

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

  async loginAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body

      const admin = await findAdminBy({ email: email.toLowerCase() })
      if (!admin) return Respond.error(res, 'admin does not exist')
      const jwt = generateJWT({email:admin._id})

      return Respond.success(res, 'Login successful', { jwt })
    } catch (err) {
      next(err)
    }
  }
}

export default new AuthController()
