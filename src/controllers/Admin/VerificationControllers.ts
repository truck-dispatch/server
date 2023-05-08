import { NextFunction, Request, Response } from 'express'
import { findUsersBy, findUserBy } from '../../data/user/userRepository'
import { findVerificationBy } from '../../data/verification/verificationRepository'
import Respond from '../../helpers/Respond'

class VerificationControllers {
  async getAllVerifications(req: Request, res: Response, next: NextFunction) {
    try {
      const Users = await findUsersBy({})
      return Respond.success(
        res,
        'All Verifications fetched successfully',
        Users
      )
    } catch (err) {
      next(err)
    }
  }

  async getVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params
      const User = await findVerificationBy({ _id:userId })
      return Respond.success(
        res,
        'Verification details fetched successfully',
        User
      )
    } catch (err) {
      next(err)
    }
  }
}

export default new VerificationControllers()
