import { Router } from 'express'
import ExternalServicesController from '@controllers/ExternalServicesController'
import JWTMiddlewares from '@middlewares/JWTMiddlewares'

const router = Router()

router.get(
  '/banks',
  JWTMiddlewares.jwtIsValid,
  ExternalServicesController.loadBanks
)
router.get(
  '/banks/account',
  JWTMiddlewares.jwtIsValid,
  ExternalServicesController.loadAccountDetails
)

export default router
