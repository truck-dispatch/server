import { Router } from 'express'
import VerificationControllers from '../../controllers/Admin/VerificationControllers'

const router = Router()
router.get('/', VerificationControllers.getAllVerifications)

router.get('/:userId', VerificationControllers.getVerification)

export default router
