import { NextFunction, Request, Response } from 'express'
import { findBidBy } from '@data/bid/bidRepository'
import {
  createPaymentRequest,
  findAndUpdatePaymentRequestBy,
  findPaymentRequestBy,
  findPaymentRequestsBy,
} from '@data/paymentRequest/paymentRequestRepository'
import { findAndUpdateTripBy, findTripBy } from '@data/trip/tripRepository'
import { findUserBy } from '@data/user/userRepository'
import { Helpers } from '@helpers/index'
import Respond from '@helpers/Respond'
import Cloudinary from '@services/Cloudinary'
import { getUserCredentialsFromReq } from '@services/JWT'
import Paystack from '@services/Paystack'
import ApiError from 'interfaces/ApiError'
import Mail from '@services/Mail'
import { FRONTEND_URL } from '@common/privateKeys'

class PaymentController {
  async requestPaymentForTrip(req: Request, res: Response, next: NextFunction) {
    try {
      const { tripId } = req.params
      const transporterCredentials = getUserCredentialsFromReq(req)
      const rawProofOfVideo = Helpers.extractFileFromReq(req, 'proofVideo')
      const proofVideo = await Cloudinary.upload({
        file: rawProofOfVideo,
        isVideo: true,
      })

      const bid = await findBidBy({
        transporter: transporterCredentials._id,
        trip: tripId,
      })
      const trip = await findTripBy({ _id: tripId })

      if (!bid) return Respond.error(res, 'bid does not exist')
      if (!trip) return Respond.error(res, 'trip does not exist')

      const paymentRequestResponse = await createPaymentRequest({
        vehicle: bid.vehicle,
        status: 'pending',
        transporter: transporterCredentials._id,
        trip: tripId,
        proofVideo,
        tripReference: trip?.reference,
        reference: Helpers.generateReference(),
        // This is used to initiate the transfer to the user's bank account when the payment is approved.
        paymentReference: Helpers.generateUuid(),
        amount: bid.price,
      })
      const updatedTrip = await findAndUpdateTripBy(
        { _id: tripId },
        { paymentRequest: paymentRequestResponse._id }
      )

      const tripOwner = await findUserBy({ _id: trip?.tripOwner._id })
      const transporter = await findUserBy({ _id: transporterCredentials._id })
      Mail.paymentHasBeenRequestedByTransporter(
        tripOwner?.email!,
        `${FRONTEND_URL}/my-trips/${tripId}/view-payment-request`,
        `${transporter?.firstName} ${transporter?.lastName}`
      )

      return Respond.success(res, 'Payment request created.', updatedTrip)
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
        transporter: user._id,
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
      const trip = await findTripBy({ _id: updatedPaymentRequest?.trip! })
      const tripOwner = await findUserBy({ _id: trip?.tripOwner._id })
      const transporter = await findUserBy({ _id: trip?.transporter?._id })
      Mail.paymentRequestHasBeenRejected(
        transporter?.email!,
        `${FRONTEND_URL}/my-trips/${trip?._id}/request-payment-for-trip`,
        `${tripOwner?.firstName} ${tripOwner?.lastName}`
      )
      return Respond.success(
        res,
        'Payment request rejected',
        trip
      )
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
        _id: paymentRequest?.transporter,
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
      const trip = await findTripBy({ _id: updatedPaymentRequest?.trip! })
      const tripOwner = await findUserBy({ _id: trip?.tripOwner._id })
      const transporter = await findUserBy({ _id: trip?.transporter?._id })
      Mail.paymentRequestHasBeenApproved(
        transporter?.email!,
        `${FRONTEND_URL}/my-trips/${trip?._id}/status`,
        `${tripOwner?.firstName} ${tripOwner?.lastName}`
      )

      return Respond.success(
        res,
        'Payment request approved',
        trip
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

      const trip = await findTripBy({ _id: updatedPaymentRequest?.trip! })
      const tripOwner = await findUserBy({ _id: trip?.tripOwner._id })
      const transporter = await findUserBy({ _id: trip?.transporter?._id })
      Mail.paymentHasBeenUpdatedByTransporter(
        tripOwner?.email!,
        `${FRONTEND_URL}/my-trips/${trip?._id}/view-payment-request`,
        `${transporter?.firstName} ${transporter?.lastName}`
      )
      return Respond.success(
        res,
        'Payment request successfully updated',
        trip
      )
    } catch (err) {
      next(err)
    }
  }
}

export default new PaymentController()
