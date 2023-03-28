import { Router } from 'express'
import ChatController from '../controllers/ChatController'
import ChatMiddlewares from '../middlewares/ChatMiddlewares'

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
router.patch(
  '/read/:chatId',
  ChatMiddlewares.chatIdExistsInParam,
  ChatController.setChatIsReadByChatId
)

export default router
