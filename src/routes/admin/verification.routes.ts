import { Router } from 'express'
import VerificationControllers from '../../controllers/Admin/VerificationControllers'

const router = Router()
router.get('/', VerificationControllers.getAllVerifications)

export default router
