import { Router } from 'express'
import TripController from '../controllers/trip.controller'
import JwtMiddlewares from '../middlewares/jwt.middlewares'
import tripMiddlewares from '../middlewares/trip.middlewares'

const router = Router()

router.post(
  '/',
  JwtMiddlewares.jwtIsValid,
  tripMiddlewares.canCreateTrip,
  TripController.createTrip
)
router.get('/', JwtMiddlewares.jwtIsValid, TripController.getTrips)
router.get(
  '/jobs',
  JwtMiddlewares.jwtIsValid,
  tripMiddlewares.canGetJobs,
  TripController.getJobs
)
router.patch(
  '/:tripId',
  JwtMiddlewares.jwtIsValid,
  tripMiddlewares.canUpdateTrip,
  TripController.updateTrip
)

export default router
