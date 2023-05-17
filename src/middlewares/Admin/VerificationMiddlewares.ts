import { findUserBy } from '@data/user/userRepository'
import { findVerificationBy } from '@data/verification/verificationRepository'
import { NextFunction, Request, Response } from 'express'
import Respond from '../../helpers/Respond'

class VerificationMiddleware {
  async checkDataForRejectingUserVerification(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { adminMessage, _id } = req.body

      if (!adminMessage) return Respond.error(res, 'Admin message was not sent')
      if (!_id)
        return Respond.error(res, 'Admin message was not sent')
      const verification = await findVerificationBy({ _id })

      if (!verification)
        return Respond.error(res, 'Verification does not exist', 404)

      next()
    } catch (err) {
      return Respond.error(res, (err as Error).message, 500)
    }
  }
  async ensureUserIsNotVerified(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { userId } = req.params

      const user = await findUserBy({ _id: userId});
      if (user?.status === 'verified') return Respond.error(res, 'User has already been verified')
      console.log(user);

      next()
    } catch (err) {
      return Respond.error(res, (err as Error).message, 500)
    }
  }
}

export default new VerificationMiddleware()
