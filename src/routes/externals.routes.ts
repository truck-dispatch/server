import { Router } from 'express'
import ExternalServicesController from '../controllers/ExternalServicesController'

const router = Router()

router.get('/banks', ExternalServicesController.loadBanks)
router.get('/banks/account', ExternalServicesController.loadAccountDetails)

export default router
