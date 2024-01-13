import Referral from '@interfaces/Referral'
import { ReferralModel } from './ReferralModel'

export async function createReferral(referral: Referral) {
  return new ReferralModel(referral).save()
}

export async function findAllReferrals(query: Partial<Referral>) {
  return ReferralModel.find(query)
    .populate('referrer', '-password')
    .populate('referred', '-password')
}
