import { Router } from 'express'

import UserController from '@controllers/Admin/UserController'

const router = Router()

router.get('/', UserController.getUsers)
router.post('/suspend/:userId', UserController.suspendUser)
router.post('/unsuspend/:userId', UserController.unSuspendUser)

export default router
