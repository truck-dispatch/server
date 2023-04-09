import { Router } from 'express'
import JWTMiddlewares from '../middlewares/JWTMiddlewares'
import ChatController from '../controllers/ChatController'
import ChatMiddlewares from '../middlewares/ChatMiddlewares'

const router = Router()

router.post(
  '/',
  JWTMiddlewares.jwtIsValid,
  ChatMiddlewares.checkDataForCreateMessage,
  ChatController.createChat
)
router.post(
  '/log',
  JWTMiddlewares.jwtIsValid,
  ChatMiddlewares.checkIfResponsibleUsersAreSent,
  ChatController.createChatLog
)
router.get(
  '/logs',
  JWTMiddlewares.jwtIsValid,
  ChatController.getChatLogs
)
router.get('/', JWTMiddlewares.jwtIsValid, ChatController.getChatsByUserId)
router.patch(
  '/read/:chatId',
  JWTMiddlewares.jwtIsValid,
  ChatMiddlewares.chatIdExistsInParam,
  ChatController.setChatIsReadByChatId
)

export default router
