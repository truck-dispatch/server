import Payment from 'interfaces/Payment'
import { PaymentModel } from './PaymentModel'

export function createPayment(paymentData: Payment) {
  const data = new PaymentModel(paymentData)

  return data.save()
}
