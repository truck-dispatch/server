import {
  jobTypes,
  shippingLines,
  sizeOfContainer,
  tripStatus,
  typeOfGoods,
} from '../common/constants'
import User from './User'

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
  transporter?: string
  tripOwnerUserType: string
  TDO?: string
  reference: string
  startTime?: string
  completionTime?: string
  status: (typeof tripStatus)[number]
}
