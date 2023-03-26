import {
  jobTypes,
  shippingLines,
  sizeOfContainer,
  tripStatus,
  typeOfGoods,
} from '../common/constants'
import Asset from './Asset'

export default interface Trip {
  _id: string
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
  tripOwner: string
  transporterId?: string
  TDO?: Asset
  paymentId?: string
  reference: string
  status: (typeof tripStatus)[number]
}
