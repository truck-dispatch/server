import { Router } from 'express'
import AuthController from '../controllers/auth.controller'
import AuthMiddlewares from '../middlewares/auth.middlewares'

const router = Router()

router.post(
  '/join',
  AuthMiddlewares.registrationCredentialChecks,
  AuthController.registerUser
)
router.post(
  '/login',
  AuthMiddlewares.loginCredentialChecks,
  AuthController.loginUser
)
router.post(
  '/verify-phone',
  AuthMiddlewares.verifyPhoneChecks,
  AuthController.verifyPhoneNumber
)
router.post(
  '/request-sms',
  AuthMiddlewares.requestSMSChecks,
  AuthController.requestSmsVerificationCode
)

export default router
