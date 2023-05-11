import { findUserBy } from '@data/user/userRepository'
import Respond from '@helpers/Respond'
import { NextFunction, Request, Response } from 'express'

class UserMiddlewares {
  async userExists(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params

      if (!userId)
        return Respond.error(res, 'User id is required for this operation', 400)

      const user = await findUserBy({ _id: userId })

      if (!user) return Respond.error(res, 'User does not exist', 404)

      next()
    } catch (err) {
      return Respond.error(res, (err as Error).message, 500)
    }
  }
}

export default new UserMiddlewares()
