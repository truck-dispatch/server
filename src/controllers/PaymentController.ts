import { NextFunction, Request, Response } from 'express'
import {
  findAndUpdateBidBy,
  findBidBy,
} from '../data/models/Bid/bid.repository'
import {
  createPaymentRequest,
  findAndUpdatePaymentRequestBy,
  findPaymentRequestBy,
  findPaymentRequestsBy,
} from '../data/models/PaymentRequest/payment-request.repository'
import { findTripBy } from '../data/models/Trip/trip.repository'
import { Helpers } from '../helpers'
import Respond from '../helpers/Respond'
import Cloudinary from '../services/Cloudinary'
import { getUserFromReq } from '../services/JWT'

class PaymentController {
  async requestPaymentForTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const { tripId } = req.params
      const transporter = getUserFromReq(req)
      const rawProofOfVideo = Helpers.extractFileFromReq(req, 'proofVideo')
      const proofVideo = await Cloudinary.upload({
        file: rawProofOfVideo,
        isVideo: true,
      })

      const bid = await findBidBy({
        transporterId: transporter._id,
        tripId,
      })
      const trip = await findTripBy({ _id: tripId })

      const paymentRequestRespond = await createPaymentRequest({
        vehicle: {
          // TODO: add driver phone number
          driver: {
            name: bid?.driverName!,
          },
          plateNumber: bid?.truckPlateNumber!,
        },
        status: 'pending',
        transporterId: transporter._id,
        tripId,
        proofVideo,
        tripReference: trip?.reference!,
        reference: Helpers.generateReference(),
        paymentReference: Helpers.generateReference(),
        amount: 1000,
      })

      return Respond.success(
        res,
        'Payment request created.',
        paymentRequestRespond
      )
    } catch (err) {
      next(err)
    }
  }

  async getPaymentRequestByTripId(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { tripId } = req.params
      if (!tripId) return Respond.error(res, 'trip id was not passed.', 400)

      const paymentRequest = await findPaymentRequestBy({ tripId })
      if (!paymentRequest)
        return Respond.error(
          res,
          'Payment request has not been uploaded yet.',
          404
        )

      return Respond.success(
        res,
        'Payment request fetched successfully...',
        paymentRequest
      )
    } catch (err) {
      next(err)
    }
  }
  async getPaymentRequestsOfTransporter(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = getUserFromReq(req)

      const paymentRequests = await findPaymentRequestsBy({
        transporterId: user._id,
      })

      return Respond.success(
        res,
        'Payment requests fetched successfully...',
        paymentRequests
      )
    } catch (err) {
      next(err)
    }
  }

  async rejectPaymentRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentRequestId } = req.params
      const { reasonForReject } = req.body

      const updatedPaymentRequest = await findAndUpdatePaymentRequestBy(
        { _id: paymentRequestId },
        { reasonForReject, status: 'rejected' }
      )

      return Respond.success(
        res,
        'Payment request rejected',
        updatedPaymentRequest
      )
    } catch (err) {
      next(err)
    }
  }
  async updatePaymentRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentRequestId } = req.params

      const paymentRequest = await findPaymentRequestBy({
        _id: paymentRequestId,
      })
      const publicId = Helpers.extractPublicIdFromURL(paymentRequest.proofVideo)

      const rawProofOfVideo = Helpers.extractFileFromReq(req, 'proofVideo')
      const proofVideo = await Cloudinary.upload({
        file: rawProofOfVideo,
        isVideo: true,
        publicId
      })
      const updatedPaymentRequest = await findAndUpdatePaymentRequestBy({ _id: paymentRequestId}, { proofVideo, status: 'pending' })

      return Respond.success(res, 'Payment request successfully updated', updatedPaymentRequest)
    } catch (err) {
      next(err)
    }
  }
}

export default new PaymentController()
