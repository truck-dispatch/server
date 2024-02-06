import { DEFAULT_ADMIN_PASSWORD } from '@common/constants'
import {
  createAdmin,
  deleteAdminById,
  findAdminBy,
  findAdminsBy,
} from '@data/Admin/adminRepository'
import Respond from '@helpers/Respond'
import { encrypt } from '@services/encrypt'
import { getUserCredentialsFromReq } from '@services/JWT'
import { NextFunction, Request, Response } from 'express'

class AdminController {
  async getAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id } = getUserCredentialsFromReq(req)
      const user = await findAdminBy({ _id })

      if (!user) return Respond.error(res, 'Profile not found')

      return Respond.success(res, 'User profile has been fetched', user)
    } catch (err) {
      next(err)
    }
  }

  async getAdmins(_: Request, res: Response, next: NextFunction) {
    try {
      const admins = await findAdminsBy({})
      return Respond.success(res, 'Admins fetched successfully', admins)
    } catch (err) {
      next(err)
    }
  }

  async addAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { firstName, lastName, email, role } = req.body

      if (!firstName || !lastName || !email || !role)
        return Respond.error(res, 'All fields are required')

      const alreadyExistingAdmin = await findAdminBy({ email })

      if (alreadyExistingAdmin)
        return Respond.error(res, 'Admin with this  email already exists')

      const password = await encrypt(DEFAULT_ADMIN_PASSWORD)

      const createdAdmin = await createAdmin({
        firstName,
        lastName,
        email,
        role,
        password,
      })

      return Respond.success(res, 'Admin created successfully', createdAdmin)
    } catch (err) {
      next(err)
    }
  }

  async removeAdmin(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminId } = req.params

      if (!adminId)
        return Respond.error(res, 'Admin to be deleted does not exist')

      const alreadyExistingAdmin = await findAdminBy({ _id: adminId })

      if (!alreadyExistingAdmin)
        return Respond.error(res, 'Admin with this  email does not exist')

      await deleteAdminById(adminId)

      return Respond.success(res, 'Admin deleted successfully')
    } catch (err) {
      next(err)
    }
  }
}

export default new AdminController()
