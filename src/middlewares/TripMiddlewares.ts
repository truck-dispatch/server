import { NextFunction, Request, Response } from 'express'
import {
  clientUserTypes,
  paymentSources,
  serviceBasedUserTypes,
  tripStatus,
} from '@common/constants'
import { findTripBy } from '@data/trip/tripRepository'
import { findUserBy } from '@data/user/userRepository'
import Respond from '@helpers/Respond'
import { getUserCredentialsFromReq } from '@services/JWT'
import PaymentRequest from '@interfaces/PaymentRequest'
import { Types } from 'mongoose'
import { findPaymentRequestBy } from '@data/paymentRequest/paymentRequestRepository'

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
      if (!(trip?.tripOwner._id as Types.ObjectId).equals(user?._id))
        return Respond.error(
          res,
          'Only the trip owner has the right to access this route.'
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
      if (
        !(trip?.tripOwner._id! as Types.ObjectId).equals(user._id) &&
        !(trip?.transporter?._id! as Types.ObjectId).equals(user._id)
      ) {
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
      if (!(trip?.transporter?._id as Types.ObjectId).equals(user._id))
        return Respond.error(
          res,
          'Only the transporter assigned to the trip can perform this operation',
          401
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
        processorReference,
        paymentSource,
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
        !paymentSource ||
        !amountInBid ||
        !totalAmountPaid
      ) {
        return Respond.error(
          res,
          'from, to, tripId, bidId, amountInBid, totalAmountPaid, paymentSource, transaction are compulsory fields.'
        )
      }
      if (!paymentSources.includes(paymentSource))
        return Respond.error(
          res,
          'the only payment sources currently available are paystack and balance.'
        )

      if (paymentSource === 'balance') {
        const { _id } = getUserCredentialsFromReq(req)

        const user = await findUserBy({ _id })
        if (user?.balance! < amountInBid) {
          return Respond.error(res, 'Insufficient balance for this bid', 400)
        }
      }

      if (paymentSource === 'paystack' && (!processorReference || !transaction))
        return Respond.error(
          res,
          'Payment processor is unavailable. Kindly reach out to support if you have been debited.'
        )

      next()
    } catch (err) {
      return Respond.error(res, (err as Error).message)
    }
  }

  async checkIfTripCanBeCancelled(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { tripId } = req.params
      const user = getUserCredentialsFromReq(req)

      const trip = await findTripBy({ _id: tripId })

      if (trip?.status !== 'awaiting-bid' && trip?.status !== 'assigned') {
        return Respond.error(
          res,
          'A trip in progress or completed cannot be cancelled.'
        )
      }
      const paymentRequestQuery: Partial<PaymentRequest> = {
        trip: tripId,
        status: 'completed',
      }

      if (serviceBasedUserTypes.includes(user.userType)) {
        paymentRequestQuery.transporter = user?._id
      }
      const paymentRequest = await findPaymentRequestBy(paymentRequestQuery)
      if (paymentRequest) {
        return Respond.error(
          res,
          'A trip with completed payment cannot be cancelled'
        )
      }

      next()
    } catch (err) {
      return Respond.error(res, (err as Error).message)
    }
  }

  async checkIfTripCanBeUnassigned(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { tripId } = req.params

      const trip = await findTripBy({ _id: tripId })

      if (trip?.status !== 'assigned' || !trip.transporter) {
        return Respond.error(
          res,
          'A trip  that has not been assigned to a transporter or is in progress or completed cannot be unassigned'
        )
      }

      const paymentRequest = await findPaymentRequestBy({ trip: tripId })
      if (paymentRequest?.status === 'completed') {
        return Respond.error(
          res,
          'A trip with completed payment cannot be unassigned'
        )
      }

      next()
    } catch (err) {
      return Respond.error(res, (err as Error).message)
    }
  }
}

export default new TripMiddlewares()
