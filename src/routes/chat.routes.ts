import { Router } from 'express'
import ChatController from '../controllers/chat.controller'
import ChatMiddlewares from '../middlewares/chat.middlewares'

const router = Router()

router.post(
  '/',
  ChatMiddlewares.checkDataForCreateMessage,
  ChatController.createChat
)
router.get(
  '/user/:userId',
  ChatMiddlewares.userIdExistsInParam,
  ChatController.getChatsByUserId
)

export default router
