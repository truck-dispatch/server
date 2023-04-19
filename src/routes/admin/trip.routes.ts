import TripController from '@controllers/admin/TripController'
import { Router } from 'express'

const router = Router()

router.get('/', TripController.getTrips)

export default router
