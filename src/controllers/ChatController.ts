import {
  createChatLog,
  findAndUpdateChatLogBy,
  findChatLogBy,
  findChatLogsBy,
} from '@data/chatLog/chatLogRepository'
import { findUserBy } from '@data/user/userRepository'
import { NextFunction, Request, Response } from 'express'
import {
  createMessage,
  findMessagesById,
  updateMessageById,
} from '@data/chat/chatRepository'
import Respond from '@helpers/Respond'
import { getConnectedUserSocketByUserId } from '@services/socket/connectedUsers.socket'
import { getUserCredentialsFromReq } from '@services/JWT'
import { serviceBasedUserTypes, clientUserTypes } from '@common/constants'
import ChatLogQuery from 'interfaces/ChatLogQuery'
import { emitMessage, emitChatLog } from '@services/socket/events.socket'

class ChatController {
  async createChatLog(req: Request, res: Response, next: NextFunction) {
    try {
      const { clientId, transporterId } = req.body
      const existingChatLog = await findChatLogBy({
        client: clientId,
        transporter: transporterId,
      })

      if (existingChatLog) {
        return Respond.success(res, 'A chatlog exists', existingChatLog)
      }

      const newChatLog = await createChatLog({
        client: clientId,
        transporter: transporterId,
      })

      const { _id } = getUserCredentialsFromReq(req)
      const receiverId = _id === clientId ? transporterId : clientId
      const receiverSocket = getConnectedUserSocketByUserId(receiverId)
      if (receiverSocket) {
        // @ts-ignore
        emitChatLog(global.io, receiverSocket, newChatLog)
      }

      return Respond.success(res, 'New chat log created.', newChatLog)
    } catch (err) {
      next(err)
    }
  }

  async getChatLogs(req: Request, res: Response, next: NextFunction) {
    try {
      const user = getUserCredentialsFromReq(req)
      const queryParam: Partial<ChatLogQuery> = {}
      if (serviceBasedUserTypes.includes(user.userType)) {
        queryParam.transporter = user._id
      } else if (clientUserTypes.includes(user.userType)) {
        queryParam.client = user._id
      }

      const chatLogs = await findChatLogsBy(queryParam)
      return Respond.success(res, 'Chat logs gotten', chatLogs)
    } catch (err) {
      next(err)
    }
  }

  async createChat(req: Request, res: Response, next: NextFunction) {
    try {
      const { message, sender, receiver, chatLog } = req.body

      const savedMessage = await createMessage({
        message,
        sender: sender,
        receiver: receiver,
        chatLog: chatLog,
      })
      await findAndUpdateChatLogBy({_id: chatLog}, { lastMessage: savedMessage._id})

      const receiverSocket = getConnectedUserSocketByUserId(
        savedMessage.receiver
      )
      if (receiverSocket) {
        // @ts-ignore
        emitMessage(global.io, receiverSocket, savedMessage)
      }
      return Respond.success(
        res,
        'Message created successfully.',
        savedMessage
      )
    } catch (err) {
      return next(err)
    }
  }

  async getUserChats(req: Request, res: Response, next: NextFunction) {
    try {
      const user = getUserCredentialsFromReq(req)

      const userChats = await findMessagesById(user._id)

      return Respond.success(res, 'Messages fetched successfully', userChats)
    } catch (err) {
      next(err)
    }
  }

  async setChatIsReadBychatLog(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { chatLog } = req.params

      const chat = await updateMessageById(chatLog, { readAt: Date.now() })

      return Respond.success(res, 'Chat read successfully.', chat)
    } catch (err) {
      next(err)
    }
  }
}

export default new ChatController()
