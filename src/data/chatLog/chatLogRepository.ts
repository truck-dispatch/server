import { findUserBy } from '../user/userRepository'
import ChatLogQuery from 'interfaces/ChatLogQuery'
import { ChatLogModel } from './ChatLogModel'
import { findLastMessage } from '../chat/chatRepository'

export async function createChatLog(data: ChatLogQuery) {
  const chatLog = new ChatLogModel(data)
  const savedChatLog = await chatLog.save()

  return savedChatLog.toObject({ versionKey: false })
}

export function findChatLogBy(searchParam: ChatLogQuery) {
  return ChatLogModel.findOne(searchParam)
    .populate('client', '-password')
    .populate('transporter', '-password')
}

export async function findChatLogsBy(searchParam: Partial<ChatLogQuery>) {
  const chatLogs = await ChatLogModel.find(searchParam)
    .populate('client', '-password')
    .populate('transporter', '-password')

  return chatLogs
}
