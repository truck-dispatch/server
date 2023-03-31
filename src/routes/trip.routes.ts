import { Router } from 'express'
import TripController from '../controllers/TripController'
import JwtMiddlewares from '../middlewares/JWTMiddlewares'
import TripMiddlewares from '../middlewares/TripMiddlewares'

const router = Router()

router.post(
  '/',
  JwtMiddlewares.jwtIsValid,
  JwtMiddlewares.checkisClientBasedUserType,
  TripMiddlewares.canCreateTrip,
  TripController.createTrip
)
router.get('/', JwtMiddlewares.jwtIsValid, TripController.getTrips)
router.get(
  '/jobs',
  JwtMiddlewares.jwtIsValid,
  JwtMiddlewares.checkIsServiceBasedUserType,
  TripController.getJobs
)
router.patch(
  '/:tripId',
  JwtMiddlewares.jwtIsValid,
  JwtMiddlewares.checkisClientBasedUserType,
  TripMiddlewares.isTripCreator,
  TripController.updateTrip
)

router.post(
  '/:tripId/assign-trip',
  JwtMiddlewares.jwtIsValid,
  JwtMiddlewares.checkisClientBasedUserType,
  TripMiddlewares.isTripCreator,
  TripMiddlewares.checkDataForTripAssignmentIsComplete,
  TripController.assignTrip
)
export default router
