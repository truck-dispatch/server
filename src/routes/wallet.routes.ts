import WalletController from '@controllers/WalletController'
import JWTMiddlewares from '@middlewares/JWTMiddlewares'
import WalletMiddlewares from '@middlewares/WalletMiddlewares'
import { Router } from 'express'

const router = Router()

router.post(
  '/top-up',
  JWTMiddlewares.jwtIsValid,
  WalletMiddlewares.allDataToTopupIsAvailable,
  WalletController.topUpWallet
)

export default router
