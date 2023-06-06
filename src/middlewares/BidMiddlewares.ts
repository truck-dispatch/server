import { NextFunction, Request, Response } from 'express'
import { findBidBy } from '@data/bid/bidRepository'
import Respond from '@helpers/Respond'
import { getUserCredentialsFromReq } from '@services/JWT'

class BidMiddlewares {
  async allRequiredDataToCreateBidIsAvailable(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { price, presentLocation, vehicle, tripId } = req.body
      const { _id } = getUserCredentialsFromReq(req)
      const bid = await findBidBy({ trip: tripId, transporter: _id })
      if (bid) {
        return Respond.error(
          res,
          'Transporter has already sent a bid for this job. Kindly update your bid incase of any changes'
        )
      }
      if (!price || !presentLocation || !tripId || !vehicle) {
        return Respond.error(
          res,
          'price, truck present location, vehicle, and trip id are required fields.'
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
      const { _id } = getUserCredentialsFromReq(req)
      const { tripId } = req.params
      if (!tripId) return Respond.error(res, 'Trip Id was not provided')
      const bid = await findBidBy({ transporter: _id, trip: tripId })

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

  async checkIfBidIsActive(req: Request, res: Response, next: NextFunction) {
    try {
      const { bidId } = req.params
      const bid = await findBidBy({ _id: bidId })
      if (bid?.status === 'accepted')
        return Respond.error(
          res,
          'You cannot delete a bid that has been accepted',
          400
        )
      next()
    } catch (err) {
      return Respond.error(res, (err as Error).message, 500)
    }
  }
}

export default new BidMiddlewares()
