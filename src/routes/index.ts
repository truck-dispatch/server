import { Router } from 'express'
import Respond from '../helpers/Respond'
import chat from './chat.routes'
const router = Router()

router.use('/chat', chat)
/* GET home page. */
router.get('/', (req, res) => {
  return Respond.success(res, 'Welcome to truckdispatch API.')
})

export default router
