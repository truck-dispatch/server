import { Types } from 'mongoose'

export default interface Vehicle {
  _id?: string
  plateNumber: string
  vehicleType: string
  owner: string | Types.ObjectId
  images: {
    frontView: string
    backView: string
    leftSideView: string
    rightSideView: string
    driversCockPit: string
    backInnerView: string
  }
  driver: {
    name: string
    phone: string
    driverLicense: string
    avatar: string
  }
}
