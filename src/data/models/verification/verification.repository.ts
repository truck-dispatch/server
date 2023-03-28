import Verification from '../../../types/Verification'
import { VerificationModel } from './VerificationModel'

export function createVerification(verification: Verification) {
  const data = new VerificationModel(verification)
  return data.save()
}

export function updateVerification(
  searchParam: Partial<Verification>,
  data: Partial<Verification>
) {
  return VerificationModel.findOneAndUpdate(searchParam, data, { new: true })
}
