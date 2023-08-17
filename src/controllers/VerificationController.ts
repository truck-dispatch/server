import { NextFunction, Request, Response } from 'express'
import { findAndUpdateUserBy } from '@data/user/userRepository'
import {
  createVerification,
  findAndUpdateVerificationBy,
  findVerificationBy,
} from '@data/verification/verificationRepository'
import { Helpers } from '@helpers/index'
import Respond from '@helpers/Respond'
import Cloudinary from '@services/Cloudinary'
import { getUserCredentialsFromReq } from '@services/JWT'
import Verification from 'interfaces/Verification'
import { createCompanyVerification } from '@data/companyVerification/companyVerificationRepository'

class VerificationController {
  async submitVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await extractedVerificationData(req)
      const user = getUserCredentialsFromReq(req)
      const verificationResponse = await createVerification({
        ...data,
        user: user._id,
      })
      await findAndUpdateUserBy(
        { _id: user._id },
        { status: 'pending_verification' }
      )

      return Respond.success(
        res,
        'User verification submitted.',
        verificationResponse
      )
    } catch (err) {
      next(err)
    }
  }

  async getVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const user = getUserCredentialsFromReq(req)

      const verificationResponse = await findVerificationBy({
        user: user._id,
      })
      if (!verificationResponse)
        return Respond.error(res, 'Verification was not found')

      return Respond.success(
        res,
        'User verification fetched',
        verificationResponse
      )
    } catch (err) {
      next(err)
    }
  }

  async updateVerification(req: Request, res: Response, next: NextFunction) {
    try {
      let verificationData = await extractedVerificationData(req)
      const user = getUserCredentialsFromReq(req)
      const prevVerification = await findVerificationBy({ user: user?._id })
      if (verificationData.guarantor) {
        verificationData.guarantor = {
          ...prevVerification?.guarantor,
          ...verificationData.guarantor,
        }
      }
      const verificationResponse = await findAndUpdateVerificationBy(
        { user: user?._id },
        verificationData
      )
      await findAndUpdateUserBy(
        { _id: user._id },
        { status: 'pending_verification' }
      )

      return Respond.success(res, 'Verification updated', verificationResponse)
    } catch (err) {
      next(err)
    }
  }

  async companyVerification(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id } = getUserCredentialsFromReq(req)
      const { companyName, companyLocation, cacReference } = req.body
      const cacDocFile = Helpers.extractFileFromReq(req, 'cacDocument')
      const cacDocument = await Cloudinary.upload({ file: cacDocFile })
      const companyDetails = {
        name: companyName,
        location: companyLocation,
        cacReference,
        cacDocument,
      }
      const updatedUser = await findAndUpdateUserBy(
        { _id },
        {
          companyVerificationStatus: 'pending_verification',
          companyDetails,
        }
      )
      await createCompanyVerification({ ...companyDetails, user: _id })

      return Respond.success(
        res,
        `Your upgrade to company request has been submitted.`,
        updatedUser
      )
    } catch (err) {
      next(err)
    }
  }
}

export default new VerificationController()

async function extractedVerificationData(req: Request) {
  const verificationData = {
    guarantor: {},
  } as Verification
  const rawIdDoc = Helpers.extractFileFromReq(req, 'idDoc')
  const rawHomeUtilityBill = Helpers.extractFileFromReq(req, 'homeUtilityBill')
  const rawGuarantorIdDoc = Helpers.extractFileFromReq(req, 'guarantor.idDoc')

  if (rawIdDoc)
    verificationData.idDoc = await Cloudinary.upload({ file: rawIdDoc })
  if (rawHomeUtilityBill)
    verificationData.homeUtilityBill = await Cloudinary.upload({
      file: rawHomeUtilityBill,
    })
  if (rawGuarantorIdDoc)
    verificationData.guarantor.idDoc = await Cloudinary.upload({
      file: rawGuarantorIdDoc,
    })
  if (req.body.facialPicture) verificationData.facialPicture = await Cloudinary.upload({
    file: req.body.facialPicture,
    extract: false
  })
  if (req.body.idType) verificationData.idType = req.body.idType
  if (req.body.homeAddress) verificationData.homeAddress = req.body.homeAddress
  if (req.body.garageAddress)
    verificationData.garageAddress = req.body.garageAddress
  if (req.body.officeAddress)
    verificationData.officeAddress = req.body.officeAddress

  if (req.body['guarantor.name'])
    verificationData.guarantor.name = req.body['guarantor.name']
  if (req.body['guarantor.email'])
    verificationData.guarantor.email = req.body['guarantor.email']
  if (req.body['guarantor.phone'])
    verificationData.guarantor.phone = req.body['guarantor.phone']
  if (req.body['guarantor.homeAddress'])
    verificationData.guarantor.homeAddress = req.body['guarantor.homeAddress']
  if (req.body['guarantor.idType'])
    verificationData.guarantor.idType = req.body['guarantor.idType']

  return verificationData
}
