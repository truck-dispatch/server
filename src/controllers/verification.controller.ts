import { NextFunction, Request, Response } from 'express'
import { findAndUpdateUserBy } from '../data/models/User/user.repository'
import { createVerification } from '../data/models/verification/verification.repository'
import { Helpers } from '../helpers'
import Respond from '../helpers/Respond'
import Cloudinary from '../services/Cloudinary'
import { getUserFromReq } from '../services/JWT'
import Verification from '../types/Verification'

class VerificationController {
  async submitVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await extractedVerificationData(req)
      const user = getUserFromReq(req)
      const verificationResponse = await createVerification({
        ...data,
        userId: user._id,
      })
      await findAndUpdateUserBy({_id: user._id}, { status: 'pending_verification'})

      return Respond.success(res, 'User verification submitted.', verificationResponse);
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

  const idDoc = await Cloudinary.upload({ file: rawIdDoc })
  const homeUtilityBill = await Cloudinary.upload({ file: rawHomeUtilityBill })
  const guarantorIdDoc = await Cloudinary.upload({ file: rawGuarantorIdDoc })

  return {
    idType: req.body.idType,
    idDoc,
    homeAddress: req.body.homeAddress,
    homeUtilityBill,
    garageAddress: req.body.garageAddress,
    officeAddress: req.body.officeAddress,
    guarantor: {
      name: req.body['guarantor.name'],
      email: req.body['guarantor.email'],
      phone: req.body['guarantor.phone'],
      homeAddress: req.body['guarantor.homeAddress'],
      idType: req.body['guarantor.idType'],
      idDoc: guarantorIdDoc
    }
  } as Verification
}
