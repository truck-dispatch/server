import Verification from '../../../types/Verification'
import { VerificationSchema } from './verification.model'

export function createVerification(verification: Verification) {
  const data = new VerificationSchema(verification)
  return data.save()
}

export function updateVerification(
  searchParam: Partial<Verification>,
  data: Partial<Verification>
) {
  return VerificationSchema.findOneAndUpdate(searchParam, data, { new: true })
}
