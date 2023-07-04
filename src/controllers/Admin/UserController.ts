import { findAndUpdateUserBy, findUsersBy, findUserBy } from '@data/user/userRepository'
import Respond from '@helpers/Respond'
import { NextFunction, Request, Response } from 'express'

class UserController {
  async getUsers(_: Request, res: Response, next: NextFunction) {
    try {
      const users = await findUsersBy({})

      return Respond.success(res, 'Users fetched successfully..', users)
    } catch (err) {
      next(err)
    }
  }

  async suspendUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params
      if (!userId) return Respond.error(res, 'userId param was not passed')
      const updatedUser = await findAndUpdateUserBy(
        { _id: userId },
        { isSuspended: true }
      )

      return Respond.success(
        res,
        'User has been suspended successfully',
        updatedUser
      )
    } catch (err) {
      next(err)
    }
  }

  async unSuspendUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params
      if (!userId) return Respond.error(res, 'userId param was not passed')
      const updatedUser = await findAndUpdateUserBy(
        { _id: userId },
        { isSuspended: false }
      )
      
      return Respond.success(
        res,
        'User has been suspended successfully',
        updatedUser
      )
    } catch (err) {
      next(err)
    }
  }

  async getUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params;

      if (!userId) return Respond.error(res, 'UserId was not passed.');

      const user = await findUserBy({_id: userId});
      if (!user) return Respond.error(res, 'User does not exist');

      return Respond.success(res, 'user fetched successfully', user);
    } catch (err) {
      next(err);
    }
  }
}

export default new UserController()
