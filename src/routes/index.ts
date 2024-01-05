import { Router } from 'express'
import Respond from '../helpers/Respond'
import chat from './chat.routes'
import auth from './auth.routes'
import trip from './trip.routes'
import verification from './verification.routes'
import user from './user.routes'
import bids from './bid.routes'
import payment from './payment.routes'
import externals from './externals.routes'
import admin from './admin.routes'
import rating from './rating.routes'
import vehicle from './vehicle.routes'
import marketing from './marketing.routes'
import getHelp from './getHelp.routes'
import wallet from './wallet.routes'

const router = Router()

router.use('/auth', auth)
router.use('/user', user)
router.use('/verification', verification)
router.use('/trips', trip)
router.use('/bids', bids)
router.use('/chat', chat)
router.use('/payment', payment)
router.use('/rating', rating)
router.use('/vehicle', vehicle)
router.use('/marketing', marketing)
router.use('/get-help', getHelp)
// Admin
router.use('/admin', admin)
// External services required by the frontend.
router.use('/externals', externals)
router.use('/wallet', wallet)

/* GET home page. */
router.get('/', (req, res) => {
  return Respond.success(res, 'Welcome to truckdispatch API.')
})

export default router
