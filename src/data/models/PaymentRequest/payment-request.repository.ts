import PaymentRequest from '../../../types/PaymentRequest'
import { PaymentRequestModel } from './PaymentRequestModel'

export function createPaymentRequest(paymentRequest: PaymentRequest) {
  const data = new PaymentRequestModel(paymentRequest)
  return data.save()
}
