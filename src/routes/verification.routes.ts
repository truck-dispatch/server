import { Router } from 'express'
import VerificationController from '../controllers/VerificationController'
import multerInstance from '../helpers/multerInstance'
import JWTMiddlewares from '../middlewares/JWTMiddlewares'
import VerificationMiddlewares from '../middlewares/VerificationMiddlewares'

const router = Router()

router.post(
  '/',
  JWTMiddlewares.jwtIsValid,
  multerInstance.fields([
    { name: 'idDoc', maxCount: 1 },
    { name: 'guarantor.idDoc', maxCount: 1 },
    { name: 'homeUtilityBill', maxCount: 1 },
  ]),
  VerificationMiddlewares.checkVerificationSubmitDetails,
  VerificationController.submitVerification
)

router.get(
  '/',
  JWTMiddlewares.jwtIsValid,
  VerificationMiddlewares.checkIfVerificationExists,
  VerificationController.getVerification
)
router.patch(
  '/',
  JWTMiddlewares.jwtIsValid,
  VerificationMiddlewares.checkIfVerificationExists,
  multerInstance.fields([
    { name: 'idDoc', maxCount: 1 },
    { name: 'guarantor.idDoc', maxCount: 1 },
    { name: 'homeUtilityBill', maxCount: 1 },
  ]),
  VerificationController.updateVerification
)

export default router
