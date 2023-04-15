import { Router } from 'express'
import UserController from '@controllers/UserController'
import multerInstance from '@helpers/multerInstance'
import JWTMiddlewares from '@middlewares/JWTMiddlewares'
import UserMiddlewares from '@middlewares/UserMiddlewares'

const router = Router()

router.get('/', JWTMiddlewares.jwtIsValid, UserController.getUser)

router.patch(
  '/',
  JWTMiddlewares.jwtIsValid,
  multerInstance.fields([{ name: 'avatar', maxCount: 1 }]),
  UserController.updateUserProfile
)
router.post(
  '/bank-details',
  JWTMiddlewares.jwtIsValid,
  JWTMiddlewares.checkIsServiceBasedUserType,
  UserMiddlewares.checkBankAccountDetails,
  UserController.addBankAccount
)
router.post(
  '/update-password',
  JWTMiddlewares.jwtIsValid,
  UserController.changePassword
)
router.patch(
  '/bank-details',
  JWTMiddlewares.jwtIsValid,
  JWTMiddlewares.checkIsServiceBasedUserType,
  UserMiddlewares.checkBankAccountDetails,
  UserController.addBankAccount
)

export default router
