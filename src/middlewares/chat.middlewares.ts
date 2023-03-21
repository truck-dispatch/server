import { NextFunction, Request, Response } from 'express'
import Respond from '../helpers/Respond'

class ChatMiddlewares {
  checkDataForCreateMessage(req: Request, res: Response, next: NextFunction) {
    const { message, senderId, receiverId, transporterId, agentId, chatId } =
      req.body

    if (!message) return Respond.error(res, 'Message was not provided', 400)
    if (!senderId)
      return Respond.error(res, 'Sender ID is required to send a message', 400)
    if (!receiverId)
      return Respond.error(
        res,
        'Receiver ID is required to send a message',
        400
      )
    if (!chatId)
      return Respond.error(res, 'Chat ID is required to send a message', 400)
    if (!transporterId || !agentId)
      return Respond.error(
        res,
        'Agent and transporter ID is required to send a message',
        400
      )

    return next()
  }
  userIdExistsInParam(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.params

    if (!userId) return Respond.error(res, 'User ID is a compulsory field')

    next()
  }
  chatIdExistsInParam(req: Request, res: Response, next: NextFunction) {
    const { chatId } = req.params

    if (!chatId) return Respond.error(res, 'User ID is a compulsory field')

    next()
  }
}

export default new ChatMiddlewares()
