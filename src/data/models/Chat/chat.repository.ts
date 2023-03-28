import Chat from '../../../types/Chat'
import { ChatModel } from './ChatModel'

export async function createMessage(message: Partial<Chat>) {
  const data = new ChatModel(message)
  return data.save()
}

export async function getMessagesById(userId: string) {
  const chatsSentByMe = await ChatModel.find({ senderId: userId })
  const chatsSentToMe = await ChatModel.find({ receiverId: userId })
  return [...chatsSentByMe, ...chatsSentToMe]
}

export async function updateMessageById(chatId: string, data: Partial<Chat>) {
  return ChatModel.findOneAndUpdate({ _id: chatId }, data)
}
