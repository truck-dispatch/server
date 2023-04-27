import { NextFunction, Request, Response } from 'express'
import { getUsers } from '../../data/user/userRepository'
import Respond from '../../helpers/Respond'

class VerificationControllers {
  async getAllVerifications(req: Request, res: Response, next: NextFunction) {
    try {
      const Users = await getUsers({})
      return Respond.success(
        res,
        'All Verifications fetched successfully',
        Users
      )
    } catch (err) {
      next(err)
    }
  }
}

export default new VerificationControllers()
