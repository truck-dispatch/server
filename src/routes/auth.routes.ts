import { Router } from 'express'
import JWTMiddlewares from '../middlewares/JWTMiddlewares'
import AuthController from '../controllers/AuthController'
import AuthMiddlewares from '../middlewares/AuthMiddlewares'

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

router.post(
  '/request-email-verification',
  JWTMiddlewares.jwtIsValid,
  AuthController.requestVerifyEmail
)
router.post('/request-reset-password', AuthController.requestResetPasswordLink)
router.post(
  '/verify-email',
  JWTMiddlewares.jwtIsValid,
  AuthMiddlewares.checkEmailVerification,
  AuthController.verifyEmail
)

export default router
