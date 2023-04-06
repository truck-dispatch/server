import { NextFunction, Request, Response } from 'express'
import {
  createMessage,
  getMessagesById,
  updateMessageById,
} from '../data/chat/chatRepository'
import Respond from '../helpers/Respond'
import { getConnectedUserSocketByUserId } from '../services/socket/connectedUsers.socket'

class ChatController {
  async createChat(req: Request, res: Response, next: NextFunction) {
    try {
      const { message, senderId, receiverId, transporterId, agentId, chatId } =
        req.body
      const messageToSave = await createMessage({
        message,
        senderId,
        receiverId,
        transporterId,
        agentId,
        chatId,
      })

      const receiverSocket = getConnectedUserSocketByUserId(
        messageToSave.receiverId
      )

      if (receiverSocket) {
        // @ts-ignore
        global.io?.to(receiverSocket).emit('message', messageToSave)
      }
      return Respond.success(
        res,
        'Message created successfully.',
        messageToSave
      )
    } catch (err) {
      return next(err)
    }
  }

  async getChatsByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const { userId } = req.params

      const userChats = await getMessagesById(userId)

      return Respond.success(res, 'Messages fetched successfully', userChats)
    } catch (err) {
      next(err)
    }
  }

  async setChatIsReadByChatId(req: Request, res: Response, next: NextFunction) {
    try {
      const { chatId } = req.params

      const chat = await updateMessageById(chatId, { readAt: Date.now() })

      return Respond.success(res, 'Chat read successfully.', chat)
    } catch (err) {
      next(err)
    }
  }
}

export default new ChatController()
