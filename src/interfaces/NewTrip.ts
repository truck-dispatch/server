import { tripStatus } from '../common/constants'

export default interface NewTrip {
  tripOwner: string
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
}
