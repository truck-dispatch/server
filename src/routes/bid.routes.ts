import { Router } from 'express'
import BidController from '@controllers/BidController'
import BidMiddlewares from '@middlewares/BidMiddlewares'
import JWTMiddlewares from '@middlewares/JWTMiddlewares'
import TripMiddlewares from '@middlewares/TripMiddlewares'

const router = Router()

router.post(
  '/:tripId',
  JWTMiddlewares.jwtIsValid,
  JWTMiddlewares.checkIsServiceBasedUserType,
  JWTMiddlewares.checkUserStatusIsVerified,
  TripMiddlewares.tripExists,
  BidMiddlewares.allRequiredDataToCreateBidIsAvailable,
  BidController.createBid
)
router.get(
  '/',
  JWTMiddlewares.jwtIsValid,
  JWTMiddlewares.checkIsServiceBasedUserType,
  BidController.getBids
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
router.delete(
  '/:tripId/:bidId',
  JWTMiddlewares.jwtIsValid,
  TripMiddlewares.tripExists,
  JWTMiddlewares.checkIsServiceBasedUserType,
  BidMiddlewares.checkIfBidIsActive,
  BidController.deleteBid
)

export default router
