import {
  jobTypes,
  shippingLines,
  sizeOfContainer,
  typeOfGoods,
} from '../common/constants'
import Asset from './Asset'

export default interface Trip {
  id: string
  pickUpAddress: string
  deliveryAddress: string
  pickUpDate: string
  deliveryDate: string
  typeOfGoods: (typeof typeOfGoods)[number]
  sizeOfContainer?: (typeof sizeOfContainer)[number]
  shippingLine?: (typeof shippingLines)[number]
  jobType?: (typeof jobTypes)[number]
  weight: number
  instructions?: string
  agentId: string
  transporterId?: string
  TDO?: Asset
  paymentId?: string
  reference: string
  status: 'awaiting_bid' | 'payment_complete' | 'in-progress' | 'completed'
}
