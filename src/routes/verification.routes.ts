import { Router } from 'express'
import multer from 'multer'
import verificationController from '../controllers/verification.controller'
import jwtMiddlewares from '../middlewares/jwt.middlewares'
import verificationMiddlewares from '../middlewares/verification.middlewares'

const upload = multer()
const router = Router()

router.post(
  '/',
  upload.fields([
    { name: 'idDoc', maxCount: 1 },
    { name: 'guarantor.idDoc', maxCount: 1 },
    { name: 'homeUtilityBill', maxCount: 1 },
  ]),
  jwtMiddlewares.jwtIsValid,
  verificationMiddlewares.checkVerificationSubmitDetails,
  verificationController.submitVerification
)

export default router
