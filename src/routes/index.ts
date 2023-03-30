import { Router } from 'express'
import Respond from '../helpers/Respond'
import chat from './chat.routes'
import auth from './auth.routes'
import trip from './trip.routes'
import verification from './verification.routes'
import user from './user.routes'
import bids from './bid.routes'
const router = Router()

router.use('/auth', auth)
router.use('/user', user)
router.use('/verification', verification)
router.use('/trips', trip)
router.use('/bids', bids)
router.use('/chat', chat)

/* GET home page. */
router.get('/', (req, res) => {
  return Respond.success(res, 'Welcome to truckdispatch API.')
})

export default router
