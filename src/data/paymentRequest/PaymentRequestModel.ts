import { model, Schema } from 'mongoose'
import PaymentRequest from '../../types/PaymentRequest'

const schema = new Schema(
  {
    //   Subsequently, this should be replaced with just the ID of the vehicle.
    vehicle: {
      type: Object,
      required: true,
    },
    proofVideo: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    transporterId: {
      type: String,
      required: true,
    },
    tripId: {
      type: String,
      required: true,
    },
    tripReference: {
      type: String,
      required: true,
    },
    paymentReference: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
      required: true,
    },
    // Check if reference exists when doing transfers.
    paymentProcessorReference: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
    /**
     * The person responsible for approving the payment's remark.
     * Only available when the payment was declined.
     */
    reasonForReject: {
      type: String,
    },
  },
  { timestamps: true }
)

export const PaymentRequestModel = model<PaymentRequest>(
  'PaymentRequest',
  schema
)
