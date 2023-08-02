import { NextFunction, Request, Response } from 'express'
import { findTripsBy } from '@data/trip/tripRepository'
import Respond from '@helpers/Respond'
import Trip from '@interfaces/Trip'
import { tripStatus } from '@common/constants'

class TripController {
  async getTrips(req: Request, res: Response, next: NextFunction) {
    const { page, limit, status } = req.query
    try {
      const paramToFetchWith: Partial<Trip> = {}
      if (tripStatus.includes(status as string))
        paramToFetchWith.status = status as string
      const trips = await findTripsBy(
        paramToFetchWith,
        page as string,
        limit as string
      )
      return Respond.success(res, 'Trips fetched successfully', { ...trips })
    } catch (err) {
      next(err)
    }
  }
}

export default new TripController()
