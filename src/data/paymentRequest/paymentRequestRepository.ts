import PaymentRequest from 'interfaces/PaymentRequest'
import { PaymentRequestModel } from './PaymentRequestModel'
import countDocuments from '@data/paginate'

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
  searchParam: Partial<PaymentRequest>,
  pageParam = '1',
  limitParam = '10'
) {
  const page = pageParam ? parseInt(pageParam) : 1
  const limit = limitParam ? parseInt(limitParam) : 10

  const data = await PaymentRequestModel.find(searchParam)
    .sort({ createdAt: 1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate({
      path: 'trip',
      populate: {
        path: 'tripOwner',
        model: 'User',
      },
    })

  const countedData = await countDocuments<PaymentRequest>(
    // @ts-ignore
    PaymentRequestModel,
    searchParam,
    pageParam,
    limitParam
  )

  return { ...countedData, data }
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
