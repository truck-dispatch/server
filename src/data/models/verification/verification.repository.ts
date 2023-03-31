import Verification from '../../../types/Verification'
import { VerificationModel } from './VerificationModel'

export function createVerification(verification: Verification) {
  const data = new VerificationModel(verification)
  return data.save()
}

export function findAndUpdateVerificationBy(
  searchParam: Partial<Verification>,
  data: Partial<Verification>
) {
  return VerificationModel.findOneAndUpdate(searchParam, data, { new: true })
}

export async function findVerificationBy(param: Partial<Verification>) {
  const verification = await VerificationModel.findOne(param)
  if (!verification) return null
  return verification
}
