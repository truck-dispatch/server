import { Router } from 'express'
import VerificationControllers from '../../controllers/Admin/VerificationControllers'

const router = Router()
router.get('/', VerificationControllers.getAllVerifications)
router.post('/verify/:userId', VerificationControllers.verifyVerification)

export default router
