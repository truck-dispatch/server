import { NextFunction, Request, Response } from 'express'
import {
  findVerificationsBy,
  findVerificationBy,
  findAndUpdateVerificationBy,
} from '../../data/verification/verificationRepository'
import {
  findAndUpdateUserBy,
  findUsersBy,
} from '../../data/user/userRepository'
import Respond from '../../helpers/Respond'

class VerificationControllers {
  async getAllVerifications(_: Request, res: Response, next: NextFunction) {
    try {
      const verifications = await findVerificationsBy({})
      return Respond.success(
        res,
        'All Verifications fetched successfully',
        verifications
      )
    } catch (err) {
      next(err)
    }
  }

  async verifyVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params
      if (!userId)
        return Respond.error(res, 'VerificationId param was not passed')
      const user = await findAndUpdateUserBy(
        { _id: userId },
        { status: 'verified' }
      )
      const verification = await findVerificationBy({ userId })
      return Respond.success(
        res,
        'Verification has been Verified successfully',
        {
          ...verification,
          user,
        }
      )
    } catch (err) {
      next(err)
    }
  }

  async rejectVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { adminMessage, _id } = req.body
      const { userId } = req.params

      const user = await findAndUpdateUserBy(
        { _id: userId },
        { status: 'rejected' }
      )

      const verification = await findAndUpdateVerificationBy(
        { _id },
        { adminMessage }
      )

      return Respond.success(res, 'User has been rejected', {
        ...verification,
        user,
      })
    } catch (err) {
      next(err)
    }
  }
}

export default new VerificationControllers()
