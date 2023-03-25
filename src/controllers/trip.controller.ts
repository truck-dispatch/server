import { NextFunction, Request, Response } from 'express'
import { createTrip } from '../data/models/trip/trip.repository'
import { Helpers } from '../helpers'
import Respond from '../helpers/Respond'
import { decodeToken } from '../services/JWT'
import Trip from '../types/Trip'
import User from '../types/User'

class TripController {
  async createTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization?.split(' ')[1]
      const user = decodeToken<User>(token!)
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

      const trip = await createTrip({
        tripOwner: user?._id,
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
        status: 'awaiting_bid',
        reference: Helpers.generateReference(),
      })

      return Respond.success(res, 'Trip created successfully', trip)
    } catch (err) {
      next(err)
    }
  }
}

export default new TripController()
