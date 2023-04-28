import { Router } from 'express'
import VerificationControllers from '../../controllers/Admin/VerificationControllers'
import JWTMiddlewares from '../../middlewares/JWTMiddlewares'
const router = Router()

router.get(
  '/',
  JWTMiddlewares.adminJwtIsValid,
  VerificationControllers.getAllVerifications
)

export default router
