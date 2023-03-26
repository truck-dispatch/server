import { Router } from 'express'
import TripController from '../controllers/trip.controller'
import JwtMiddlewares from '../middlewares/jwt.middlewares'
import tripMiddlewares from '../middlewares/trip.middlewares'

const router = Router()

router.post(
  '/',
  JwtMiddlewares.jwtIsValid,
  tripMiddlewares.createTrip,
  TripController.createTrip
)
router.get('/', JwtMiddlewares.jwtIsValid, TripController.getTrips)
router.patch(
  '/:tripId',
  JwtMiddlewares.jwtIsValid,
  tripMiddlewares.updateTrip,
  TripController.updateTrip
)

export default router
