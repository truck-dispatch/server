import { Router } from 'express'
import TripController from '@controllers/Admin/TripController'

const router = Router()

router.get('/', TripController.getTrips)

export default router
