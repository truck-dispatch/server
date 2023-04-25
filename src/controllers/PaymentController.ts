import { NextFunction, Request, Response } from 'express'
import { findBidBy } from '@data/bid/bidRepository'
import {
  createPaymentRequest,
  findAndUpdatePaymentRequestBy,
  findPaymentRequestBy,
  findPaymentRequestsBy,
} from '@data/paymentRequest/paymentRequestRepository'
import { findTripBy } from '@data/trip/tripRepository'
import { findUserBy } from '@data/user/userRepository'
import { Helpers } from '@helpers/index'
import Respond from '@helpers/Respond'
import Cloudinary from '@services/Cloudinary'
import { getUserCredentialsFromReq } from '@services/JWT'
import Paystack from '@services/Paystack'
import ApiError from 'interfaces/ApiError'
import Mail from '@services/Mail'

class PaymentController {
  async requestPaymentForTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const { tripId } = req.params
      const transporter = getUserCredentialsFromReq(req)
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
      if (!bid) return Respond.error(res, 'bid does not exist')
      const paymentRequestResponse = await createPaymentRequest({
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
        paymentReference: Helpers.generateUuid(),
        amount: bid.price,
      })
      // Send mail here
      Mail

      return Respond.success(
        res,
        'Payment request created.',
        paymentRequestResponse
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
      const user = getUserCredentialsFromReq(req)

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
      // Send mail here
    } catch (err) {
      next(err)
    }
  }

  async approvePaymentRequest(req: Request, res: Response, next: NextFunction) {
    try {
      const { paymentRequestId } = req.params
      const paymentRequest = await findPaymentRequestBy({
        _id: paymentRequestId,
      })
      const user = await findUserBy({
        _id: paymentRequest?.transporterId,
      })

      const transferData = {
        source: 'balance',
        reason: `TruckDispatch trip-${paymentRequest?.tripReference} payment-${paymentRequest?.reference}`,
        reference: paymentRequest?.paymentReference!,
        recipient: user?.bankDetails.paystackRecipientCode!,
        amount: Helpers.nairaToKobo(paymentRequest?.amount!),
      }

      await Paystack.makeTransfer(transferData).catch((err: ApiError) => {
        throw new Error(err.response?.data?.message)
      })

      const updatedPaymentRequest = await findAndUpdatePaymentRequestBy(
        { _id: paymentRequestId },
        { status: 'completed' }
      )

      return Respond.success(
        res,
        'Payment request approved',
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

      const rawProofOfVideo = Helpers.extractFileFromReq(req, 'proofVideo')
      const proofVideo = await Cloudinary.upload(
        {
          file: rawProofOfVideo,
          isVideo: true,
        },
        paymentRequest?.proofVideo
      )

      const updatedPaymentRequest = await findAndUpdatePaymentRequestBy(
        { _id: paymentRequestId },
        { proofVideo, status: 'pending', reasonForReject: '' }
      )

      return Respond.success(
        res,
        'Payment request successfully updated',
        updatedPaymentRequest
      )
    } catch (err) {
      next(err)
    }
  }
}

export default new PaymentController()
