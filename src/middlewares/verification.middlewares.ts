import { NextFunction, Request, Response } from 'express'
import { Helpers } from '../helpers'
import Respond from '../helpers/Respond'

class VerificationMiddlewares {
  checkVerificationSubmitDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
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
}

export default new VerificationMiddlewares()
