import { Router } from 'express'
import admin from './admin/admin.routes'
import auth from './admin/auth.routes'
import verification from './admin/verification.routes'
import trip from './admin/trip.routes'
import users from './admin/users.routes'
import JWTMiddlewares from '@middlewares/JWTMiddlewares'

const router = Router()
// TODO: add global jwt handler for admin routes
router.use('/', admin)
router.use('/auth', auth)
router.use('/verifications', JWTMiddlewares.checkAdminJwt, verification)
router.use('/trips', JWTMiddlewares.checkAdminJwt, trip)
router.use('/users', JWTMiddlewares.checkAdminJwt, users)

export default router
