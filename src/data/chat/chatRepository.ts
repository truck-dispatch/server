import { ObjectId } from 'mongodb'
import Chat from 'interfaces/Chat'
import { ChatModel } from './ChatModel'
import { Types } from 'mongoose'

export async function createMessage(message: Partial<Chat>) {
  const data = new ChatModel(message)
  return data.save()
}

export async function findMessagesById(userId: string | Types.ObjectId) {
  const chatsSentByMe = await ChatModel.find({ sender: userId })
  const chatsSentToMe = await ChatModel.find({ receiver: userId })
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
