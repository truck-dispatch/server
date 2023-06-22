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
  return VerificationModel.findOne(param).populate('user', '-password');
}

export function findVerificationsBy(param: Partial<Verification>) {
  return VerificationModel.find(param)
  .sort({ updatedAt: -1 }).populate('user', '-password')
}
