import { Router } from 'express'
import JWTMiddlewares from '@middlewares/JWTMiddlewares'
import ReferralController from '@controllers/ReferralController'

const router = Router()

router.get('/', JWTMiddlewares.jwtIsValid, ReferralController.getReferees)

export default router
