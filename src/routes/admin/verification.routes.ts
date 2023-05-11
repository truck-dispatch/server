import { Router } from 'express'
import UserMiddlewares from '@middlewares/Admin/UserMiddlewares'
import VerificationControllers from '@controllers/Admin/VerificationControllers'
import VerificationMiddlewares from '@middlewares/Admin/VerificationMiddlewares'

const router = Router()

router.get('/', VerificationControllers.getAllVerifications)
router.patch(
  '/verify/:userId',
  UserMiddlewares.userExists,
  VerificationMiddlewares.ensureUserIsNotVerified,
  VerificationControllers.verifyVerification
)
router.patch(
  '/reject/:userId',
  UserMiddlewares.userExists,
  VerificationMiddlewares.checkDataForRejectingUserVerification,
  VerificationControllers.rejectVerification
)

export default router
