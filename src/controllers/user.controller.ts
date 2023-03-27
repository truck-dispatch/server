import { NextFunction, Request, Response } from 'express'
import { findUserBy } from '../data/models/User/user.repository'
import Respond from '../helpers/Respond'
import { getUserFromReq } from '../services/JWT'

class UserController {
  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id } = getUserFromReq(req)
      const user = await findUserBy({ _id })

      if (!user) return Respond.error(res, 'Profile not found')

      return Respond.success(res, 'User profile has been fetched', user)
    } catch (err) {
      next(err)
    }
  }

  async submitVerification(req: Request, res: Response, next: NextFunction) {}
}

export default new UserController()
