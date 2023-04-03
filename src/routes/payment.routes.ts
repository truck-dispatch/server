import { Router } from 'express'
import multer from 'multer'
import PaymentController from '../controllers/PaymentController'
import JWTMiddlewares from '../middlewares/JWTMiddlewares'
import PaymentMiddlewares from '../middlewares/PaymentMiddlewares'
import TripMiddlewares from '../middlewares/TripMiddlewares'

const router = Router()

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public')
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1]
    cb(null, `files/admin-${file.fieldname}-${Date.now()}.${ext}`)
  },
})
const multerInstance = multer({
  storage,
})
router.post(
  '/request-payment/trip/:tripId',
  JWTMiddlewares.jwtIsValid,
  JWTMiddlewares.checkIsServiceBasedUserType,
  JWTMiddlewares.checkUserStatusIsVerified,
  TripMiddlewares.isTripTransporter,
  multerInstance.fields([{ name: 'proofVideo', maxCount: 1 }]),
  PaymentMiddlewares.checkDataRequiredForRequestPayment,
  PaymentController.requestPaymentForTrip
)
router.patch(
  '/request-payment/trip/:tripId/update/:paymentRequestId',
  JWTMiddlewares.jwtIsValid,
  JWTMiddlewares.checkIsServiceBasedUserType,
  JWTMiddlewares.checkUserStatusIsVerified,
  TripMiddlewares.isTripTransporter,
  multerInstance.fields([{ name: 'proofVideo', maxCount: 1 }]),
  PaymentMiddlewares.checkDataRequiredForRequestPayment,
  PaymentController.updatePaymentRequest
)

router.get(
  '/payment-request/trip/:tripId',
  JWTMiddlewares.jwtIsValid,
  PaymentController.getPaymentRequestByTripId
)
router.get(
  '/payment-requests',
  JWTMiddlewares.jwtIsValid,
  JWTMiddlewares.checkIsServiceBasedUserType,
  PaymentController.getPaymentRequestsOfTransporter
)

router.post(
  '/payment-request/trip/:tripId/reject/:paymentRequestId',
  JWTMiddlewares.jwtIsValid,
  JWTMiddlewares.checkisClientBasedUserType,
  TripMiddlewares.isTripCreator,
  PaymentMiddlewares.checkDataIsRequiredToChangeStatusOfPaymentRequest,
  PaymentController.rejectPaymentRequest
)

export default router
