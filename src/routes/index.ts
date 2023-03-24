import { Router } from 'express'
import Respond from '../helpers/Respond'
import chat from './chat.routes'
import auth from './auth.routes'

const router = Router()

router.use('/chat', chat)
router.use('/auth', auth)

/* GET home page. */
router.get('/', (req, res) => {
  return Respond.success(res, 'Welcome to truckdispatch API.')
})

export default router
