import { findUserBy } from '../data/user/userRepository'
import { NextFunction, Request, Response } from 'express'
import Respond from '../helpers/Respond'

class ChatMiddlewares {
  checkDataForCreateMessage(req: Request, res: Response, next: NextFunction) {
    const { message, senderId, receiverId, chatId } =
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

    return next()
  }

  async checkIfResponsibleUsersAreSent(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { clientId, transporterId } = req.body
      if (!clientId || !transporterId) return Respond.error(res, 'clientId, transporterId are compulsory fields')

      const client = await findUserBy({_id: clientId})
      if (!client) return Respond.error(res, 'client does not exist...')
      const transporter = await findUserBy({_id: transporterId})
      if (!transporter) return Respond.error(res, 'transporter does not exist...')

      next()
    } catch (err) {
      return Respond.error(res, (err as Error).message)
    }
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
