import { Router } from 'express'
import TripController from '../controllers/trip.controller'
import JwtMiddlewares from '../middlewares/jwt.middlewares'
import tripMiddlewares from '../middlewares/trip.middlewares'

const router = Router()

router.post(
  '/new',
  JwtMiddlewares.jwtIsValid,
  tripMiddlewares.createTrip,
  TripController.createTrip
)

export default router
