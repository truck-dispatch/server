import { Router } from 'express'
import auth from './admin/auth.routes'
import trip from './admin/trip.routes'
import users from './admin/users.routes'
import JWTMiddlewares from '@middlewares/JWTMiddlewares'

const router = Router()
// TODO: add global jwt handler for admin routes
router.use('/auth', auth)
router.use('/trips', JWTMiddlewares.checkAdminJwt, trip)
router.use('/users', JWTMiddlewares.checkAdminJwt, users)

export default router
