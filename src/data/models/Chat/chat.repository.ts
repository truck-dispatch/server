import Chat from '../../../types/Chat'
import { ChatSchema } from './chat.model'

export async function createMessage(message: Partial<Chat>) {
  const data = new ChatSchema(message)
  return data.save()
}

export async function getMessagesById(userId: string) {
  const chatsSentByMe = await ChatSchema.find({ senderId: userId })
  const chatsSentToMe = await ChatSchema.find({ receiverId: userId })
  return [...chatsSentByMe, ...chatsSentToMe]
}

export async function updateMessageById(chatId: string, data: Partial<Chat>) {
  return ChatSchema.findOneAndUpdate({ _id: chatId }, data)
}
