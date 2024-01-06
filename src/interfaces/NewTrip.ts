import { Types } from 'mongoose'
import { tripStatus } from '../common/constants'

export default interface NewTrip {
  tripOwner: string | Types.ObjectId
  pickUpAddress: string
  deliveryAddress: string
  pickUpDate: string
  deliveryDate: string
  typeOfGoods: string
  tripOwnerUserType: string
  weight: string
  sizeOfContainer: string
  shippingLine: string
  jobType: string
  instructions: string
  status: (typeof tripStatus)[number]
  reference: string
  proposedPrice: number
}
