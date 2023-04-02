import { Router } from 'express'
import UserController from '../controllers/UserController'
import JWTMiddlewares from '../middlewares/JWTMiddlewares'
import UserMiddlewares from '../middlewares/UserMiddlewares'

const router = Router()

router.get('/', JWTMiddlewares.jwtIsValid, UserController.getUser)

router.post(
  '/bank-details',
  JWTMiddlewares.jwtIsValid,
  JWTMiddlewares.checkIsServiceBasedUserType,
  UserMiddlewares.checkBankAccountDetails,
  UserController.addBankAccount
)
router.patch(
  '/bank-details',
  JWTMiddlewares.jwtIsValid,
  JWTMiddlewares.checkIsServiceBasedUserType,
  UserMiddlewares.checkBankAccountDetails,
  UserController.addBankAccount
)

export default router
