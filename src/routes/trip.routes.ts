import { Router } from 'express'
import TripController from '../controllers/TripController'
import JwtMiddlewares from '../middlewares/JWTMiddlewares'
import TripMiddlewares from '../middlewares/TripMiddlewares'

const router = Router()

router.post(
  '/',
  JwtMiddlewares.jwtIsValid,
  TripMiddlewares.canCreateTrip,
  TripController.createTrip
)
router.get('/', JwtMiddlewares.jwtIsValid, TripController.getTrips)
router.get(
  '/jobs',
  JwtMiddlewares.jwtIsValid,
  TripMiddlewares.canGetJobs,
  TripController.getJobs
)
router.patch(
  '/:tripId',
  JwtMiddlewares.jwtIsValid,
  TripMiddlewares.canUpdateTrip,
  TripController.updateTrip
)

export default router
