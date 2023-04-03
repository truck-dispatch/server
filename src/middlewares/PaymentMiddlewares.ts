import { NextFunction, Request, Response } from 'express'
import { findBidBy } from '../data/models/Bid/bid.repository'
import { findPaymentRequestBy } from '../data/models/PaymentRequest/payment-request.repository'
import { Helpers } from '../helpers'
import Respond from '../helpers/Respond'
import { getUserFromReq } from '../services/JWT'

class PaymentMiddlewares {
  async checkDataRequiredForRequestPayment(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { tripId } = req.params

      const transporter = getUserFromReq(req)
      const rawProofOfVideo = Helpers.extractFileFromReq(req, 'proofVideo')
      if (!rawProofOfVideo)
        return Respond.error(res, 'proofVideo was not provided')

      const bid = await findBidBy({
        transporterId: transporter._id,
        tripId,
      })
      if (!bid)
        return Respond.error(res, 'You do not have a bid for this trip.')
      next()
    } catch (err) {
      return Respond.error(res, (err as Error).message)
    }
  }

  async checkDataIsRequiredToChangeStatusOfPaymentRequest(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { paymentRequestId } = req.params

      const paymentRequest = await findPaymentRequestBy({
        _id: paymentRequestId,
      })

      if (!paymentRequest)
        return Respond.error(res, 'Payment request not found', 404)

      if (paymentRequest.status === 'completed')
        return Respond.error(
          res,
          'Status of payment request cannot be changed after it has been completed'
        )

      next()
    } catch (err) {
      next(err)
    }
  }
}

export default new PaymentMiddlewares()
