import { NextFunction, Request, Response } from 'express'
import { createVerification } from '../data/models/verification/verification.repository'
import { Helpers } from '../helpers'
import Respond from '../helpers/Respond'
import Cloudinary from '../services/Cloudinary'
import { getUserFromReq } from '../services/JWT'

class VerificationController {
  async submitVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await extractedVerificationData(req)
      console.log(data, 'data')
      if (!data) return;
      const user = getUserFromReq(req)
      // const verification = await createVerification({
      //   ...req.body,
      //   userId: user._id,
      // })

      return Respond.error(res, 'User verification submitted.')
    } catch (err) {
      next(err)
    }
  }
}

export default new VerificationController()

async function extractedVerificationData(req: Request) {
  const rawIdDoc = Helpers.extractFileFromReq(req, 'idDoc')
  const rawHomeUtilityBill = Helpers.extractFileFromReq(req, 'homeUtilityBill')
  const rawGuarantorIdDoc = Helpers.extractFileFromReq(req, 'guarantor.idDoc')

  const cloudinary = new Cloudinary(true)
  const idDoc = await cloudinary.upload({ file: rawIdDoc })
  console.log(idDoc)
  return {}
}
