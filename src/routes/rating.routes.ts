import { Router } from 'express'
import RatingMiddlewares from '@middlewares/RatingMiddlewares'
import RatingController from '@controllers/RatingController'
import JWTMiddlewares from '@middlewares/JWTMiddlewares'
import TripMiddlewares from '@middlewares/TripMiddlewares'

const router = Router()

router.post(
  '/:tripId',
  JWTMiddlewares.jwtIsValid,
  TripMiddlewares.checkIfUserIsAssociatedToTrip,
  RatingMiddlewares.allDataForRatingIsCorrect,
  RatingController.rateUser
)

router.get(
  '/:tripId',
  JWTMiddlewares.jwtIsValid,
  TripMiddlewares.checkIfUserIsAssociatedToTrip,
  RatingController.getUsersTripRating
)

export default router
