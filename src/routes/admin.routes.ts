import { Router } from 'express'
import AuthController from '../controllers/Admin/AuthController'
import AuthMiddlewares from '../middlewares/Admin/AuthMiddlewares'

const router = Router()

router.post(
  '/join',
  AuthMiddlewares.registrationCredentialsChecks,
  AuthController.registerAdmin
)

export default router
