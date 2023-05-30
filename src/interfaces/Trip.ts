import { Types } from 'mongoose'
import {
  jobTypes,
  shippingLines,
  sizeOfContainer,
  tripStatus,
  typeOfGoods,
} from '../common/constants'

export default interface Trip {
  _id: Types.ObjectId | string
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
  tripOwner: Types.ObjectId | string
  transporter?: Types.ObjectId | string | null
  tripOwnerUserType: string
  TDO?: string
  reference: string
  startTime?: string
  completionTime?: string
  status: (typeof tripStatus)[number]
}
