import {
  createChatLog,
  findChatLogBy,
  findChatLogsBy,
} from '../data/chatLog/chatLogRepository'
import { findUserBy } from '../data/user/userRepository'
import { NextFunction, Request, Response } from 'express'
import {
  createMessage,
  findMessagesById,
  updateMessageById,
} from '../data/chat/chatRepository'
import Respond from '../helpers/Respond'
import { getConnectedUserSocketByUserId } from '../services/socket/connectedUsers.socket'
import { getUserFromReq } from '../services/JWT'
import { serviceBasedUserTypes, clientUserTypes } from '../common/constants'
import ChatLogQuery from '../types/ChatLogQuery'
import { emitMessage, emitChatLog } from '../services/socket/events.socket'

class ChatController {
  async createChatLog(req: Request, res: Response, next: NextFunction) {
    try {
      const { clientId, transporterId } = req.body
      const client = await findUserBy({ _id: clientId })
      const transporter = await findUserBy({ _id: transporterId })
      const existingChatLog = await findChatLogBy({ clientId, transporterId })

      if (existingChatLog) {
        return Respond.success(res, 'A chatlog exists', {
          ...existingChatLog,
          client,
          transporter,
        })
      }

      const newChatLog = await createChatLog({ clientId, transporterId })

      const { _id } = getUserFromReq(req)
      const receiverId = _id === clientId ? transporterId : clientId
      const receiverSocket = getConnectedUserSocketByUserId(
        receiverId
        )
      if (receiverSocket) {
        // @ts-ignore
        emitChatLog(global.io, receiverSocket, {
          ...newChatLog,
          client,
          transporter,
        })
      }

      return Respond.success(res, 'New chat log created.', {
        ...newChatLog,
        client,
        transporter,
      })
    } catch (err) {
      next(err)
    }
  }

  async getChatLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const user = getUserFromReq(req)
      const queryParam: Partial<ChatLogQuery> = {}
      if (serviceBasedUserTypes.includes(user.userType)) {
        queryParam.transporterId = user._id
      } else if (clientUserTypes.includes(user.userType)) {
        queryParam.clientId = user._id
      }

      const chatLogs = await findChatLogsBy(queryParam)

      return Respond.success(res, 'Chat logs gotten', chatLogs)
    } catch (err) {
      next(err)
    }
  }

  async createChat(req: Request, res: Response, next: NextFunction) {
    try {
      const { message, senderId, receiverId, chatId } = req.body

      const messageToSave = await createMessage({
        message,
        senderId,
        receiverId,
        chatId,
      })

      const receiverSocket = getConnectedUserSocketByUserId(
        messageToSave.receiverId
      )

      if (receiverSocket) {
        // @ts-ignore
        emitMessage(global.io, receiverSocket, messageToSave)
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

  async getUserChats(req: Request, res: Response, next: NextFunction) {
    try {
      const user = getUserFromReq(req)

      const userChats = await findMessagesById(user._id)
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
