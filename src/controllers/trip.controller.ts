import { NextFunction, Request, Response } from 'express'
import { createTrip } from '../data/models/trip/trip.repository'
import { Helpers } from '../helpers'
import Respond from '../helpers/Respond'
import Trip from '../types/Trip'

class TripController {
  async createTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        agentId,
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
        agentId,
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
      } as Trip)

      return Respond.success(res, 'Trip created successfully', trip)
    } catch (err) {
      next(err)
    }
  }
}

export default new TripController()
