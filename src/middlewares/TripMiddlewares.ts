import { NextFunction, Request, Response } from 'express'
import { tripStatus } from '@common/constants'
import { findTripBy } from '@data/trip/tripRepository'
import { findUserBy } from '@data/user/userRepository'
import Respond from '@helpers/Respond'
import { getUserCredentialsFromReq } from '@services/JWT'

class TripMiddlewares {
  canCreateTrip(req: Request, res: Response, next: NextFunction) {
    try {
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
      } = req.body

      if (
        !pickUpAddress ||
        !deliveryAddress ||
        !pickUpDate ||
        !deliveryDate ||
        !typeOfGoods ||
        !weight
      ) {
        return Respond.error(
          res,
          'pickUpAddress, deliveryAddress, pickUpDate, deliveryDate, typeOfGoods, weight are compulsory fields.'
        )
      }

      if (
        typeOfGoods === 'container' &&
        (!sizeOfContainer || !shippingLine || !jobType)
      ) {
        return Respond.error(
          res,
          'sizeOfContainer, shippingLine, and jobType are compulsory fields.'
        )
      }

      next()
    } catch (err) {
      return Respond.error(res, (err as Error).message)
    }
  }

  async isTripCreator(req: Request, res: Response, next: NextFunction) {
    try {
      const user = getUserCredentialsFromReq(req)
      const { tripId } = req.params

      if (!tripId) return Respond.error(res, 'Trip ID was not provided', 400)

      const trip = await findTripBy({ _id: tripId })
      if (!trip) return Respond.error(res, 'Trip was not found.')
      if (trip?.tripOwner._id !== user._id)
        return Respond.error(
          res,
          'Only the trip owner has the right to update this trip'
        )

      next()
    } catch (err) {
      // Report error to our client..
      console.log(err)
      return Respond.error(res, (err as Error).message)
    }
  }

  async checkIfUserIsAssociatedToTrip(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { tripId } = req.params
      const user = getUserCredentialsFromReq(req)

      const trip = await findTripBy({ _id: tripId })
      if (trip?.tripOwner._id !== user._id && trip?.transporter?._id !== user._id) {
        return Respond.error(res, 'User is not associated to this trip.', 401)
      }
      next()
    } catch (err) {
      // Report error to our client..
      console.log(err)
      return Respond.error(res, (err as Error).message)
    }
  }
  async checkIfStatusChangeIsAccepted(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { tripId, status } = req.params
      const statusIndex = tripStatus.findIndex((s) => status === s)
      if (statusIndex === -1) {
        return Respond.error(res, `${status} is not an acceptable status`, 400)
      }
      const trip = await findTripBy({ _id: tripId })
      const presentStatusIndex = tripStatus.findIndex((s) => trip?.status === s)

      if (presentStatusIndex > statusIndex)
        return Respond.error(res, 'Trip is past this status stage')

      next()
    } catch (err) {
      // Report error to our client..
      console.log(err)
      return Respond.error(res, (err as Error).message)
    }
  }

  async isTripTransporter(req: Request, res: Response, next: NextFunction) {
    try {
      const user = getUserCredentialsFromReq(req)
      const { tripId } = req.params

      if (!tripId) return Respond.error(res, 'Trip ID was not provided', 400)

      const trip = await findTripBy({ _id: tripId })
      if (!trip) return Respond.error(res, 'Trip was not found.')
      if (trip?.transporter?._id !== user._id)
        return Respond.error(
          res,
          'Only the transporter assigned to the trip can perform this operation'
        )

      next()
    } catch (err) {
      // Report error to our client..
      console.log(err)
      return Respond.error(res, (err as Error).message)
    }
  }

  async tripExists(req: Request, res: Response, next: NextFunction) {
    try {
      const { tripId } = req.params

      if (!tripId) return Respond.error(res, 'Trip Id was not provided')

      const trip = await findTripBy({ _id: tripId })
      if (!trip) return Respond.error(res, 'Trip does not exist', 404)

      next()
    } catch (err) {
      return Respond.error(res, (err as Error).message)
    }
  }

  async checkDataForTripAssignmentIsComplete(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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

      if (!to) return Respond.error(res, 'to field was not passed.', 400)

      const transporter = await findUserBy({ _id: to })
      if (!transporter)
        return Respond.error(res, 'Transporter does not exist', 404)

      if (transporter.status !== 'verified')
        return Respond.error(res, 'Transporter is not verified yet.')

      if (
        !from ||
        !to ||
        !tripId ||
        !bidId ||
        !paymentReference ||
        !amountInBid ||
        !totalAmountPaid ||
        !transaction
      ) {
        return Respond.error(
          res,
          'from, to, tripId, bidId, paymentReference, amountInBid, totalAmountPaid, transaction are compulsory fields.'
        )
      }

      next()
    } catch (err) {
      return Respond.error(res, (err as Error).message)
    }
  }
}

export default new TripMiddlewares()
