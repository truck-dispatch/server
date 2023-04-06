import { NextFunction, Request, Response } from 'express'
import { findVerificationBy } from '../data/models/Verification/VerificationRepository'
import { Helpers } from '../helpers'
import Respond from '../helpers/Respond'
import { getUserFromReq } from '../services/JWT'

class VerificationMiddlewares {
  async checkVerificationSubmitDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = getUserFromReq(req)
      if (user.status === 'verified' || user.userType === 'agent') {
        return Respond.error(
          res,
          'User has either been verified, or is not allowed to partake in verification'
        )
      }

      const verification = await findVerificationBy({ userId: user._id })

      if (verification)
        return Respond.error(
          res,
          'User verification has already been submitted'
        )
      const { idType, homeAddress, garageAddress, officeAddress } = req.body
      const idDoc = Helpers.extractFileFromReq(req, 'idDoc')
      const homeUtilityBill = Helpers.extractFileFromReq(req, 'homeUtilityBill')
      const guarantorIdDoc = Helpers.extractFileFromReq(req, 'guarantor.idDoc')
      if (
        !idType ||
        !homeAddress ||
        !garageAddress ||
        !officeAddress ||
        !idDoc ||
        !homeUtilityBill ||
        !guarantorIdDoc ||
        !req.body['guarantor.name'] ||
        !req.body['guarantor.email'] ||
        !req.body['guarantor.phone'] ||
        !req.body['guarantor.homeAddress'] ||
        !req.body['guarantor.idType']
      ) {
        return Respond.error(
          res,
          'idType, homeAddress, garageAddress, officeAddress, idDoc, homeUtilityBill, guarantorIdDoc and all guarantor details are all compulsory fields.'
        )
      }
      next()
    } catch (e) {
      return Respond.error(res, 'Something went wrong...', 500)
    }
  }
  async checkIfVerificationExists(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = getUserFromReq(req)

      if (user.status === 'verified')
        return Respond.error(res, 'User has already been verified', 400)

      const verification = await findVerificationBy({ userId: user._id })

      if (!verification)
        return Respond.error(res, 'User has not submitted a verification yet. ')

      next()
    } catch (err) {
      return Respond.error(res, 'Something went wrong...', 500)
    }
  }
}

export default new VerificationMiddlewares()
