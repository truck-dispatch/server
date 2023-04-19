import { findUsersBy } from '@data/user/userRepository'
import Respond from '@helpers/Respond'
import { NextFunction, Request, Response } from 'express'

class UserController {
  async getUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const users = await findUsersBy({})

      return Respond.success(res, 'Users fetched successfully..', users)
    } catch (err) {
      next(err)
    }
  }
}

export default new UserController()
