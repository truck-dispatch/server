import { Router } from 'express'
import HelpController from '@controllers/HelpController'

const router = Router()

router.post('/', HelpController.sendGetHelpData)

export default router
