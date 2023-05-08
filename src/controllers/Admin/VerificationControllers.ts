import { NextFunction, Request, Response } from 'express'
import { findVerificationsBy } from '../../data/verification/verificationRepository'
import Respond from '../../helpers/Respond'

class VerificationControllers {
  async getAllVerifications(req: Request, res: Response, next: NextFunction) {
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
}

export default new VerificationControllers()
