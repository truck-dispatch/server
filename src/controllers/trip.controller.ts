import { NextFunction, Request, Response } from 'express'
import { canCreateTrip } from '../common/constants'
import {
  createTrip,
  findTripsBy,
  updateTrip,
} from '../data/models/trip/trip.repository'
import { Helpers } from '../helpers'
import Respond from '../helpers/Respond'
import { getUserFromReq } from '../services/JWT'
import Trip from '../types/Trip'

class TripController {
  async createTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const user = getUserFromReq(req)
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

  async getTrips(req: Request, res: Response, next: NextFunction) {
    try {
      const user = getUserFromReq(req)

      const paramToFetchWith: Partial<Trip> = {}
      if (canCreateTrip.includes(user.userType)) {
        paramToFetchWith.tripOwner = user._id
      } else {
        paramToFetchWith.transporterId = user._id
      }
      const trips = await findTripsBy(paramToFetchWith)

      return Respond.success(res, 'Trips fetched successfully', trips)
    } catch (err) {
      next(err)
    }
  }

  async updateTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const { tripId } = req.params

      const trip = await updateTrip({ _id: tripId }, req.body)
      return Respond.success(res, 'Trip updated successfully', trip)
    } catch (err) {
      next(err)
    }
  }
}

export default new TripController()
