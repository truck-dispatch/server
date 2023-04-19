import { NextFunction, Request, Response } from 'express'
import { findTripsBy } from '@data/trip/tripRepository'
import Respond from '@helpers/Respond'

class TripController {
  async getTrips(req: Request, res: Response, next: NextFunction) {
    try {
      const trips = await findTripsBy({})
      return Respond.success(res, 'Trips fetched successfully', trips)
    } catch (err) {
      next(err)
    }
  }
}

export default new TripController()
