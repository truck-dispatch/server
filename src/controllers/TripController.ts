import {
  findUserBy,
  findAndUpdateUserBy,
  debitUserLedgerBalance,
  creditUser,
  creditUserLedgerBalance,
  debitUser,
} from '@data/user/userRepository'
import { NextFunction, Request, Response } from 'express'
import { clientUserTypes, tripStatus } from '@common/constants'
import { findAndUpdateBidBy, findBidBy } from '@data/bid/bidRepository'
import {
  createTrip,
  deleteTrip,
  findAndUpdateTripBy,
  findTripBy,
  findTripsBy,
  getAvailableJobNumbers,
  getTripNumbers,
} from '@data/trip/tripRepository'
import { Helpers } from '@helpers/index'
import Respond from '@helpers/Respond'
import Cloudinary from '@services/Cloudinary'
import { getUserCredentialsFromReq } from '@services/JWT'
import Trip from 'interfaces/Trip'
import Mail from '@services/Mail'
import { FRONTEND_URL } from '@common/privateKeys'
import PopulatedTrip from '@interfaces/PopulatedTrip'
import { findAndDeletePaymentRequestsBy } from '@data/paymentRequest/paymentRequestRepository'
import { Types } from 'mongoose'
import { emitRemoveTrip, emitTripDetails } from '@services/socket/events.socket'
import { getConnectedUserSocketByUserId } from '@services/socket/connectedUsers.socket'

class TripController {
  async createTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const user = getUserCredentialsFromReq(req)
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
        tripOwnerUserType: user?.userType!,
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
        status: 'awaiting-bid',
        reference: Helpers.generateReference(),
      })
      Mail.newTripCreated()
      return Respond.success(res, 'Trip created successfully', trip)
    } catch (err) {
      next(err)
    }
  }

  async getTrips(req: Request, res: Response, next: NextFunction) {
    try {
      const user = getUserCredentialsFromReq(req)
      const { page, limit, status } = req.query

      const paramToFetchWith: Partial<Trip> = {}
      if (clientUserTypes.includes(user.userType)) {
        paramToFetchWith.tripOwner = user._id
      } else {
        paramToFetchWith.transporter = user._id
      }
      const tripNumbers = await getTripNumbers(paramToFetchWith)
      if (tripStatus.includes(status as string))
        paramToFetchWith.status = status as string
      const paginatedTripsData = await findTripsBy(
        paramToFetchWith,
        page as string,
        limit as string
      )

      return Respond.success(res, 'Trips fetched successfully', {
        ...paginatedTripsData,
        ...tripNumbers,
      })
    } catch (err) {
      next(err)
    }
  }

  async getTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const { tripId } = req.params

      const trip = await findTripBy({ _id: tripId })

      return Respond.success(res, 'Trip fetched', trip)
    } catch (err) {
      next(err)
    }
  }

  async getJob(req: Request, res: Response, next: NextFunction) {
    try {
      const { tripId } = req.params

      const trip = await findTripBy({ _id: tripId })

      return Respond.success(res, 'Trip fetched', trip)
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
  async getJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit, senderType } = req.query

      const query: Partial<Trip> = { status: 'awaiting-bid' }

      if (clientUserTypes.includes(senderType as string))
        query.tripOwnerUserType = senderType as string

      const paginatedJobsData = await findTripsBy(
        query,
        page as string,
        limit as string
      )
      const jobNumbers = await getAvailableJobNumbers()
      return Respond.success(res, 'Trips fetched successfully.', {
        ...paginatedJobsData,
        ...jobNumbers,
      })
    } catch (err) {
      next(err)
    }
  }

  async changeTripStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { tripId, status } = req.params
      let updatedTrip: PopulatedTrip | null
      if (status === 'completed') {
        updatedTrip = await setTripToCompleted(tripId)
      } else if (status === 'in-progress') {
        updatedTrip = await setTripToInProgress(tripId)
      } else {
        return Respond.error(res, 'This is not an acceptable status')
      }
      const receiverSocket = getConnectedUserSocketByUserId(updatedTrip?.tripOwner._id!)
      if (receiverSocket) {
        // @ts-ignore
        emitTripDetails(global.io, receiverSocket, updatedTrip)
      }
      return Respond.success(
        res,
        'Trip status has been changed successfully.',
        updatedTrip!
      )
    } catch (err) {
      next(err)
    }
  }

  async assignTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        from,
        to,
        tripId,
        bidId,
        paymentSource,
      } = req.body
      const transporter = await findUserBy({ _id: to })
      const bid = await findAndUpdateBidBy(
        { _id: bidId },
        { status: 'accepted' }
      )

      if (paymentSource === 'balance') {
        await debitUser(from, bid?.price!)
      }

      const [updatedUser, trip] = await Promise.all([
        creditUserLedgerBalance(from, bid?.price!),
        findAndUpdateTripBy(
          { _id: tripId },
          { transporter: to, status: 'assigned', acceptedBid: bidId }
        ),
      ])

      Mail.bidHasBeenAccepted(
        transporter?.email!,
        trip?.pickUpAddress!,
        trip?.deliveryAddress!,
        `${updatedUser?.firstName} ${updatedUser?.lastName}`,
        `${updatedUser?.avatar}`,
        `${FRONTEND_URL}/my-trips/${tripId}`
      )
      const receiverSocket = getConnectedUserSocketByUserId(transporter?._id!)
      if (receiverSocket) {
        // @ts-ignore
        emitTripDetails(global.io, receiverSocket, trip)
      }
      return Respond.success(res, 'Trip assigned to transporter successfully', {
        trip,
        user: updatedUser,
      })
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

      const receiverSocket = getConnectedUserSocketByUserId(updatedTrip?.transporter?._id!)
      if (receiverSocket) {
        // @ts-ignore
        emitTripDetails(global.io, receiverSocket, updatedTrip)
      }
      return Respond.success(res, 'TDO has been uploaded', updatedTrip)
    } catch (err) {
      next(err)
    }
  }

  async unassignTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const { tripId } = req.params

      const updatedTrip = await findAndUpdateTripBy(
        { _id: tripId },
        { transporter: null, status: 'awaiting-bid', acceptedBid: null }
      )
      // revert balance back to tripOwner;
      const bid = await findAndUpdateBidBy(
        { trip: tripId, status: 'accepted' },
        { status: 'pending' }
      )
      const [_, user] = await refundTripOwnerMoneyForCancelledTrip(
        updatedTrip?.tripOwner._id!,
        updatedTrip?._id!,
        bid?.price!
      )
      const receiverSocket = getConnectedUserSocketByUserId(updatedTrip?.transporter?._id!)
      if (receiverSocket) {
        // @ts-ignore
        emitRemoveTrip(global.io, receiverSocket, updatedTrip._id);
      }

      // TODO: Notify transporter that trip has been unassigned
      return Respond.success(res, 'Trip has been unassigned..', {
        trip: updatedTrip,
        user,
      })
    } catch (err) {
      next(err)
    }
  }

  async cancelTripByTripOwner(req: Request, res: Response, next: NextFunction) {
    try {
      const { tripId } = req.params
      const user = getUserCredentialsFromReq(req)

      const trip = await findTripBy({ _id: tripId })
      if (trip?.transporter) {
        // revert balance back to tripOwner;
        const bid = await findBidBy({
          trip: tripId,
          transporter: trip.transporter._id,
        })
        await refundTripOwnerMoneyForCancelledTrip(
          user._id,
          trip?._id!,
          bid?.price!
        )
      }

      await deleteTrip(tripId)

      const receiverSocket = getConnectedUserSocketByUserId(trip?.transporter?._id!)
      if (receiverSocket) {
        // @ts-ignore
        emitRemoveTrip(global.io, receiverSocket, tripId);
      }

      // TODO: Notify transporter that trip has been cancelled
      return Respond.success(res, 'Trip has been cancelled.')
    } catch (err) {
      next(err)
    }
  }
  async cancelTripByTransporter(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = getUserCredentialsFromReq(req)
      const { tripId } = req.params

      const trip = await findTripBy({ _id: tripId })
      const bid = await findBidBy({ trip: tripId, transporter: user._id })
      const updatedTrip = await findAndUpdateTripBy(
        { _id: trip?._id },
        { transporter: null, status: 'awaiting-bid', acceptedBid: null }
      )
      await refundTripOwnerMoneyForCancelledTrip(
        trip?.tripOwner._id!,
        trip?._id!,
        bid?.price!
      )
      const receiverSocket = getConnectedUserSocketByUserId(trip?.tripOwner?._id!)
      if (receiverSocket) {
        // @ts-ignore
        emitTripDetails(global.io, receiverSocket, updatedTrip)
      }
      // Notify transporter that trip has been cancelled
      return Respond.success(res, 'Trip has been cancelled.')
    } catch (err) {
      next(err)
    }
  }
}
export default new TripController()

async function setTripToCompleted(tripId: string) {
  const updatedTrip = await findAndUpdateTripBy(
    { _id: tripId },
    { status: 'completed', completionTime: new Date().toISOString() }
  )
  const user = await findUserBy({ _id: updatedTrip?.transporter?._id })
  const completedTrips = user?.completedTrips! + 1
  await findAndUpdateUserBy({ _id: user?._id! }, { completedTrips })
  const tripOwner = await findUserBy({ _id: updatedTrip?.tripOwner._id })
  Mail.tripHasBeenSetToCompleted(
    tripOwner?.email!,
    `${FRONTEND_URL}/my-trips/${tripId}`,
    `${user?.firstName} ${user?.lastName}`
  )

  return updatedTrip
}

async function setTripToInProgress(tripId: string) {
  const updatedTrip = await findAndUpdateTripBy(
    { _id: tripId },
    { status: 'in-progress', startTime: new Date().toISOString() }
  )
  const user = await findUserBy({ _id: updatedTrip?.transporter?._id })
  const tripOwner = await findUserBy({ _id: updatedTrip?.tripOwner._id })
  Mail.tripHasBeenSetToInProgress(
    tripOwner?.email!,
    `${FRONTEND_URL}/my-trips/${tripId}`,
    `${user?.firstName} ${user?.lastName}`
  )

  return updatedTrip
}

async function refundTripOwnerMoneyForCancelledTrip(
  tripOwner: string | Types.ObjectId,
  tripId: string | Types.ObjectId,
  priceInBid: number
) {
  // For a transporter to exist, a price must have been paid prior to now.
  return Promise.all([
    debitUserLedgerBalance(tripOwner, priceInBid),
    creditUser(tripOwner, priceInBid),
    // If we happen to accept multiple payments under the same trip, this may need to be refactored.
    findAndDeletePaymentRequestsBy({ trip: tripId }),
  ])
}
