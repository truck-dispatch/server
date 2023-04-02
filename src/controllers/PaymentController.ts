import { NextFunction, Request, Response } from 'express'
import { findBidBy } from '../data/models/Bid/bid.repository'
import { createPaymentRequest } from '../data/models/PaymentRequest/payment-request.repository'
import { findTripBy, findTripsBy } from '../data/models/Trip/trip.repository'
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
}

export default new PaymentController()
