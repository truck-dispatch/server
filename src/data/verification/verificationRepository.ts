import { findUserBy } from '@data/user/userRepository'
import Verification from 'interfaces/Verification'
import { VerificationModel } from './VerificationModel'

export function createVerification(verification: Verification) {
  const data = new VerificationModel(verification)
  return data.save()
}

export function findAndUpdateVerificationBy(
  searchParam: Partial<Verification>,
  data: Partial<Verification>
) {
  return VerificationModel.findOneAndUpdate(searchParam, data, {
    new: true,
  }).lean()
}

export async function findVerificationBy(param: Partial<Verification>) {
  const verification = await VerificationModel.findOne(param).lean()
  if (!verification) return null
  return verification
}

export async function findVerificationsBy(param: Partial<Verification>) {
  const verifications = await VerificationModel.find(param).lean()
  const data = await Promise.all(
    verifications.map(async (verification) => {
      const user = await findUserBy({ _id: verification.userId })
      return {
        ...verification,
        user,
      }
    })
  )
  return data
}
