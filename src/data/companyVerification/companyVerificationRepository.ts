import Company from '@interfaces/Company'
import { CompanyVerificationModel } from './CompanyVerificationModel'

export function createCompanyVerification(data: Company) {
  const companyVerification = new CompanyVerificationModel(data)
  return companyVerification.save()
}
