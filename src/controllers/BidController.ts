import { NextFunction, Request, Response } from 'express'
import {
  createBid,
  findAndUpdateBidBy,
  findBidBy,
  findBidsBy,
} from '../data/models/Bid/bid.repository'
import Respond from '../helpers/Respond'
import { getUserFromReq } from '../services/JWT'

class BidController {
  async createBid(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        extraNotes,
        price,
        presentLocation,
        driverName,
        truckPlateNumber,
        tripId,
      } = req.body
      const user = getUserFromReq(req)
      const bidResponse = await createBid({
        extraNotes,
        price,
        presentLocation,
        transporterId: user._id,
        driverName,
        truckPlateNumber,
        tripId,
        status: 'pending',
      })
      return Respond.success(
        res,
        'Bid has been created successfully',
        bidResponse
      )
    } catch (err) {
      next(err)
    }
  }

  async updateBid(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id } = getUserFromReq(req)
      const bidResponse = await findAndUpdateBidBy(
        { transporterId: _id, tripId: req.body.tripId },
        req.body
      )

      return Respond.success(res, 'Bid updated successfully', bidResponse)
    } catch (err) {
      next(err)
    }
  }

  async getTripBids(req: Request, res: Response, next: NextFunction) {
    try {
      const { tripId } = req.params
      const bidsResponse = await findBidsBy({ tripId })
      return Respond.success(res, 'Bids found successfully', bidsResponse)
    } catch (err) {
      next(err)
    }
  }

  async getTransporterBidToTrip(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { _id } = getUserFromReq(req)
      const { tripId } = req.params
      const bidResponse = await findBidBy({
        tripId: tripId,
        transporterId: _id,
      })
      return Respond.success(res, 'Bid found successfully', bidResponse)
    } catch (err) {
      next(err)
    }
  }
}

export default new BidController()
