import { Router } from 'express'
import PaymentController from '../controllers/PaymentController'
import JWTMiddlewares from '../middlewares/JWTMiddlewares'
import PaymentMiddlewares from '../middlewares/PaymentMiddlewares'
import TripMiddlewares from '../middlewares/TripMiddlewares'

const router = Router()

router.post(
  '/request-payment/trip/:tripId',
  JWTMiddlewares.jwtIsValid,
  JWTMiddlewares.checkIsServiceBasedUserType,
  JWTMiddlewares.checkUserStatusIsVerified,
  TripMiddlewares.isTripTransporter,
  PaymentMiddlewares.checkDataRequiredForRequestPayment,
  PaymentController.requestPaymentForTrip
)

export default router