import Payment from 'interfaces/Payment'
import { PaymentLogModel } from './PaymentLogModel'

/** Payment logs are money paid to our company. this is how we keep records of financial inflow. */
export function createPaymentLog(paymentData: Payment) {
  const data = new PaymentLogModel(paymentData)

  return data.save()
}

export function findPaymentLogBy(param: Partial<Payment>) {
  return PaymentLogModel.findOne(param)
}
