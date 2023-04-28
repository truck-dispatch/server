import { Router } from 'express'
import auth from './admin/auth.routes'
import allVerfication from "./admin/allVerification.routes"

const router = Router()

router.use('/auth', auth)
router.use('/verifications', allVerfication)

export default router
