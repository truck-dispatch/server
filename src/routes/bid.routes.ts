import { Router } from 'express'
import BidController from '../controllers/BidController'
import BidMiddlewares from '../middlewares/BidMiddlewares'
import JWTMiddlewares from '../middlewares/JWTMiddlewares'
import TripMiddlewares from '../middlewares/TripMiddlewares'

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
  '/',
  JWTMiddlewares.jwtIsValid,
  JWTMiddlewares.checkIsServiceBasedUserType,
  JWTMiddlewares.checkUserStatusIsVerified,
  BidMiddlewares.canUpdateBid,
  BidController.updateBid
)
router.get(
  '/:tripId',
  JWTMiddlewares.jwtIsValid,
  JWTMiddlewares.checkisClientBasedUserType,
  TripMiddlewares.isTripCreator,
  BidController.getTripBids
)
export default router
