import PaymentRequest from 'interfaces/PaymentRequest'
import { PaymentRequestModel } from './PaymentRequestModel'

export function createPaymentRequest(paymentRequest: PaymentRequest) {
  const data = new PaymentRequestModel(paymentRequest)
  return data.save()
}

export async function findPaymentRequestBy(
  searchParam: Partial<PaymentRequest>
) {
  const data = await PaymentRequestModel.findOne(searchParam).lean()
  return data
}
export async function findPaymentRequestsBy(
  searchParam: Partial<PaymentRequest>
) {
  const data = await PaymentRequestModel.find(searchParam).lean()
  return data
}

export async function findAndUpdatePaymentRequestBy(
  searchParam: Partial<PaymentRequest>,
  data: Partial<PaymentRequest>
) {
  return PaymentRequestModel.findOneAndUpdate(searchParam, data, {
    new: true,
  }).lean()
}

export async function findAndDeletePaymentRequestsBy(
  searchParam: Partial<PaymentRequest>
) {
  return PaymentRequestModel.deleteMany(searchParam)
}
