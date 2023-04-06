import { NextFunction, Request, Response } from 'express'
import { clientUserTypes } from '../common/constants'
import { findAndUpdateBidBy } from '../data/models/bid/BidRepository'
import { createPayment } from '../data/models/Payment/PaymentRepository'
import {
  createTrip,
  findAndUpdateTripBy,
  findTripsBy,
} from '../data/models/trip/trip_repository'
import { Helpers } from '../helpers'
import Respond from '../helpers/Respond'
import Cloudinary from '../services/Cloudinary'
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
      if (clientUserTypes.includes(user.userType)) {
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

      const trip = await findAndUpdateTripBy({ _id: tripId }, req.body)
      return Respond.success(res, 'Trip updated successfully', trip)
    } catch (err) {
      next(err)
    }
  }

  /**
   * Only available for a transporter account.
   * @param req
   * @param res
   * @param next
   * @returns
   */
  async getJobs(_: Request, res: Response, next: NextFunction) {
    try {
      const trips = await findTripsBy({ status: 'awaiting_bid' })

      return Respond.success(res, 'Trips fetched successfully.', trips)
    } catch (err) {
      next(err)
    }
  }

  async changeTripStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { tripId, status } = req.params
      
      const updatedTrip = await findAndUpdateTripBy({ _id: tripId }, { status })

      return Respond.success(res, 'Trip has been updated successfully', updatedTrip)
    } catch (err) {}
  }

  async assignTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        from,
        to,
        tripId,
        bidId,
        paymentReference,
        amountInBid,
        totalAmountPaid,
        transaction,
      } = req.body

      await Promise.all([
        createPayment({
          from,
          to,
          tripId,
          bidId,
          amountInBid,
          totalAmountPaid,
          paymentReference,
          transaction,
          tripReference: Helpers.generateReference(),
          status: 'success',
        }),
        findAndUpdateBidBy({ _id: bidId }, { status: 'accepted' }),
      ])

      const trip = await findAndUpdateTripBy(
        { _id: tripId },
        { transporterId: to, status: 'payment_complete' }
      )

      return Respond.success(
        res,
        'Trip assigned to transporter successfully',
        trip
      )
    } catch (err) {
      next(err)
    }
  }

  async uploadTDO(req: Request, res: Response, next: NextFunction) {
    try {
      const { tripId } = req.params
      const rawTDO = Helpers.extractFileFromReq(req, 'TDO')
      if (!rawTDO) return Respond.error(res, 'TDO file was not uploaded...')
      const TDO = await Cloudinary.upload({ file: rawTDO })

      const updatedTrip = await findAndUpdateTripBy({ _id: tripId }, { TDO })

      return Respond.success(res, 'TDO has been uploaded', updatedTrip)
    } catch (err) {
      next(err)
    }
  }
}
export default new TripController()
