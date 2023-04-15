import { Router } from 'express'
import auth from './admin/auth.routes'
import trip from './admin/trip.routes'

const router = Router()

router.use('/auth', auth)
router.use('/trip', trip)
export default router
