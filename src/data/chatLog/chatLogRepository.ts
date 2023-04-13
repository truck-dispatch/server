import { findUserBy } from '../user/userRepository'
import ChatLogQuery from 'types/ChatLogQuery'
import { ChatLogModel } from './ChatLogModel'
import { findLastMessage } from '../chat/chatRepository'

export async function createChatLog(data: ChatLogQuery) {
  const chatLog = new ChatLogModel(data)
  const savedChatLog = await chatLog.save()

  return savedChatLog.toObject({ versionKey: false })
}

export function findChatLogBy(searchParam: ChatLogQuery) {
  return ChatLogModel.findOne(searchParam).lean()
}

export async function findChatLogsBy(searchParam: Partial<ChatLogQuery>) {
  const chatLogs = await ChatLogModel.find(searchParam).lean()

  return Promise.all(
    chatLogs.map(async (log) => {
      const client = await findUserBy({ _id: log.clientId })
      const transporter = await findUserBy({ _id: log.transporterId })
      const lastMessage = await findLastMessage(log._id)

      return {
        ...log,
        client,
        transporter,
        lastMessage,
      }
    })
  )
}
