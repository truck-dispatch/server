import { ObjectId } from 'mongodb'
import Chat from 'interfaces/Chat'
import { ChatModel } from './ChatModel'

export async function createMessage(message: Partial<Chat>) {
  const data = new ChatModel(message)
  return data.save()
}

export async function findMessagesById(userId: string) {
  const chatsSentByMe = await ChatModel.find({ senderId: userId })
  const chatsSentToMe = await ChatModel.find({ receiverId: userId })
  return [...chatsSentByMe, ...chatsSentToMe]
}

export async function findLastMessage(chatLog: ObjectId) {
  const lastMessage = await ChatModel.findOne({ chatLog }).sort({
    createdAt: -1,
  })
  if (!lastMessage) return null
  return lastMessage
}
export async function updateMessageById(chatLog: string, data: Partial<Chat>) {
  return ChatModel.findOneAndUpdate({ _id: chatLog }, data)
}
