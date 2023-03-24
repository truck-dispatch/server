import { Router } from 'express'
import Respond from '../helpers/Respond'
import chat from './chat.routes'
import auth from './auth.routes'
import trip from './trip.routes'
const router = Router()

router.use('/auth', auth)
router.use('/trips', trip)
router.use('/chat', chat)

/* GET home page. */
router.get('/', (req, res) => {
  return Respond.success(res, 'Welcome to truckdispatch API.')
})

export default router
