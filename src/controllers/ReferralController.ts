import { findAllReferrals } from '@data/referral/referralRepository'
import Respond from '@helpers/Respond'
import { getUserCredentialsFromReq } from '@services/JWT'
import { NextFunction, Request, Response } from 'express'

class ReferralController {
  async getReferees(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id } = getUserCredentialsFromReq(req)
      const referrals = await findAllReferrals({ referrer: _id })

      return Respond.success(res, "Referred users fetched suuccessfully", referrals)
    } catch (err) {
      next(err)
    }
  }
}

export default new ReferralController()
