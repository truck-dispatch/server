import { NextFunction, Request, Response } from 'express'
import Respond from '../helpers/Respond'
import { decodeToken } from '../services/JWT'
import User from '../types/User'

const canCreateTrip = ['agent', 'company']
class TripMiddlewares {
  createTrip(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1]

    const {
      pickUpAddress,
      deliveryAddress,
      pickUpDate,
      deliveryDate,
      typeOfGoods,
      weight,
      sizeOfContainer,
      shippingLine,
      jobType,
      instructions,
    } = req.body

    const user = decodeToken<User>(token!)

    if (!canCreateTrip.includes(user.userType))
      return Respond.error(
        res,
        'This feature is not available for your user type'
      )

    if (
      !pickUpAddress ||
      !deliveryAddress ||
      !pickUpDate ||
      !deliveryDate ||
      !typeOfGoods ||
      !weight
    ) {
      return Respond.error(
        res,
        'pickUpAddress, deliveryAddress, pickUpDate, deliveryDate, typeOfGoods, weight are compulsory fields.'
      )
    }

    if (
      typeOfGoods === 'container' && (!sizeOfContainer ||
      !shippingLine ||
      !jobType)
    ) {
      return Respond.error(
        res,
        'sizeOfContainer, shippingLine, and jobType are compulsory fields.'
      )
    }

    next()
  }
}

export default new TripMiddlewares()