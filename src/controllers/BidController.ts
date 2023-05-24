import { NextFunction, Request, Response } from 'express'
import {
  createBid,
  findActiveBidsBy,
  findAndUpdateBidBy,
  findBidBy,
  findBidsBy,
} from '@data/bid/bidRepository'
import Respond from '@helpers/Respond'
import { getUserCredentialsFromReq } from '@services/JWT'
import Mail from '@services/Mail'
import { findTripBy } from '@data/trip/tripRepository'
import { findUserBy } from '@data/user/userRepository'
import { FRONTEND_URL } from '@common/privateKeys'

class BidController {
  async createBid(req: Request, res: Response, next: NextFunction) {
    try {
      const { extraNotes, price, presentLocation, vehicle, tripId } = req.body
      const user = getUserCredentialsFromReq(req)
      const bidResponse = await createBid({
        extraNotes,
        price,
        presentLocation,
        transporter: user._id,
        trip: tripId,
        vehicle,
        status: 'pending',
      })
      const trip = await findTripBy({ _id: tripId })
      const tripOwner = await findUserBy({ _id: trip?.tripOwner._id })
      const transporter = await findUserBy({ _id: user?._id! })

      Mail.transporterHasSentBid(
        tripOwner?.email!,
        `${transporter?.firstName} ${transporter?.lastName}`,
        `${FRONTEND_URL}/my-trips/${tripId}/bids/${bidResponse._id}`
      )
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
      const { _id } = getUserCredentialsFromReq(req)
      const { tripId } = req.body
      const bidResponse = await findAndUpdateBidBy(
        { transporter: _id, trip: req.body.tripId },
        req.body
      )
      const trip = await findTripBy({ _id: tripId })
      const tripOwner = await findUserBy({ _id: trip?.tripOwner._id })
      const transporter = await findUserBy({ _id })

      Mail.transporterHasUpdatedBid(
        tripOwner?.email!,
        `${transporter?.firstName} ${transporter?.lastName}`,
        `${FRONTEND_URL}/my-trips/${tripId}/bids/${bidResponse?._id}`
      )

      return Respond.success(res, 'Bid updated successfully', bidResponse)
    } catch (err) {
      next(err)
    }
  }

  async getTripBids(req: Request, res: Response, next: NextFunction) {
    try {
      const { tripId } = req.params
      const tripBids = await findBidsBy({ trip: tripId })
      return Respond.success(res, 'Bids found successfully', tripBids)
    } catch (err) {
      next(err)
    }
  }

  async getBids(req: Request, res: Response, next: NextFunction) {
    try {
      const { _id } = getUserCredentialsFromReq(req)

      const bids = await findActiveBidsBy({ transporter: _id })
      return Respond.success(res, 'Active bids fetched', bids)
    } catch (err) {
      next(err)
    }
  }
}

export default new BidController()
