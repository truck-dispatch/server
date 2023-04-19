import { Router } from 'express'
import auth from './admin/auth.routes'
import trip from './admin/trip.routes'
import users from './user.routes'

const router = Router()
// TODO: add global jwt handler for admin routes
router.use('/auth', auth)
router.use('/trips', trip)
router.use('/users', users)

export default router
