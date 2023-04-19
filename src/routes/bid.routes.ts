import { Router } from 'express'
import BidController from '@controllers/BidController'
import BidMiddlewares from '@middlewares/BidMiddlewares'
import JWTMiddlewares from '@middlewares/JWTMiddlewares'
import TripMiddlewares from '@middlewares/TripMiddlewares'

const router = Router()

router.post(
  '/',
  JWTMiddlewares.jwtIsValid,
  JWTMiddlewares.checkIsServiceBasedUserType,
  JWTMiddlewares.checkUserStatusIsVerified,
  BidMiddlewares.allRequiredDataToCreateBidIsAvailable,
  BidController.createBid
)
router.patch(
  '/:tripId',
  JWTMiddlewares.jwtIsValid,
  JWTMiddlewares.checkIsServiceBasedUserType,
  JWTMiddlewares.checkUserStatusIsVerified,
  TripMiddlewares.tripExists,
  BidMiddlewares.checkHasSubmittedABidToJob,
  BidController.updateBid
)
router.get(
  '/:tripId',
  JWTMiddlewares.jwtIsValid,
  JWTMiddlewares.checkisClientBasedUserType,
  TripMiddlewares.tripExists,
  TripMiddlewares.isTripCreator,
  BidController.getTripBids
)
router.get(
  '/transporter-bid/:tripId',
  JWTMiddlewares.jwtIsValid,
  JWTMiddlewares.checkIsServiceBasedUserType,
  TripMiddlewares.tripExists,
  BidMiddlewares.checkHasSubmittedABidToJob,
  BidController.getTransporterBidToTrip
)

export default router
