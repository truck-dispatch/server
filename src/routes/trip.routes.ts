import { Router } from 'express'
import TripController from '../controllers/trip.controller'
import JwtMiddlewares from '../middlewares/jwt.middlewares'

const router = Router()

router.post('/new', JwtMiddlewares.jwtIsValid, JwtMiddlewares.checkIsAgent, TripController.createTrip);

export default router