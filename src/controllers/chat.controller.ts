import { NextFunction, Request, Response } from 'express';
import { ChatSchema } from '../data/models/chat.model';
import Respond from '../helpers/Respond';

class ChatController {
  async createChat(req: Request, res: Response, next: NextFunction) {
    try {
      const { message, senderId, receiverId, transporterId, agentId, chatId } =
        req.body
      const messageToSave = new ChatSchema({
        message,
        senderId,
        receiverId,
        transporterId,
        agentId,
        chatId,
      })
      await messageToSave.save();

      // @ts-ignore
      req.io.emit('message', messageToSave);
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

      const chatsSentByMe = await ChatSchema.find({ senderId: userId })
      const chatsSentToMe = await ChatSchema.find({ receiverId: userId })

      return Respond.success(res, 'Messages fetched successfully', [
        ...chatsSentByMe,
        ...chatsSentToMe,
      ])
    } catch (err) {
      next(err)
    }
  }
  getChatsByChatId(req: Request, res: Response) {

  }
}

export default new ChatController()
