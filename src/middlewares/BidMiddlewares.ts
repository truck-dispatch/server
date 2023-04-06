import { NextFunction, Request, Response } from 'express'
import { findBidBy } from '../data/models/bid/BidRepository'
import Respond from '../helpers/Respond'
import { getUserFromReq } from '../services/JWT'

class BidMiddlewares {
  async allRequiredDataToCreateBidIsAvailable(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { price, presentLocation, driverName, truckPlateNumber, tripId } =
        req.body
      const { _id } = getUserFromReq(req)
      const bid = await findBidBy({ tripId, transporterId: _id })
      if (bid) {
        return Respond.error(
          res,
          'Transporter has already sent a bid for this job. Kindly update your bid incase of any changes'
        )
      }
      if (
        !price ||
        !presentLocation ||
        !driverName ||
        !truckPlateNumber ||
        !tripId
      ) {
        return Respond.error(
          res,
          'price, truck present location, driver name, truck plate number, and trip id are required fields.'
        )
      }
      next()
    } catch (err) {
      return Respond.error(res, (err as Error).message, 500)
    }
  }

  async checkHasSubmittedABidToJob(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { _id } = getUserFromReq(req)
      const { tripId } = req.params
      if (!tripId) return Respond.error(res, 'Trip Id was not provided')
      const bid = await findBidBy({ transporterId: _id, tripId })

      if (!bid)
        return Respond.error(
          res,
          'You are yet to submit a bid for this trip.',
          404
        )

      next()
    } catch (err) {
      return Respond.error(res, (err as Error).message, 500)
    }
  }
}

export default new BidMiddlewares()
