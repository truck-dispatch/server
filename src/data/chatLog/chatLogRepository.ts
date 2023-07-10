import ChatLogQuery from 'interfaces/ChatLogQuery'
import { ChatLogModel } from './ChatLogModel'

export async function createChatLog(data: ChatLogQuery) {
  const chatLog = new ChatLogModel(data)
  const savedChatLog = await chatLog.save()

  return findChatLogBy({ _id: savedChatLog._id })
}

export function findChatLogBy(searchParam: ChatLogQuery) {
  return ChatLogModel.findOne(searchParam)
    .populate('client', '-password')
    .populate('transporter', '-password')
    .populate('lastMessage')
}

export async function findChatLogsBy(searchParam: Partial<ChatLogQuery>) {
  const chatLogs = await ChatLogModel.find(searchParam)
    .populate('client', '-password')
    .populate('transporter', '-password')
    .populate('lastMessage')

  return chatLogs
}
export async function findAndUpdateChatLogBy(
  searchParam: Partial<ChatLogQuery>,
  data: Partial<ChatLogQuery>
) {
  const chatLogs = await ChatLogModel.findOneAndUpdate(searchParam, data, {
    new: true,
  })
    .populate('client', '-password')
    .populate('transporter', '-password')
    .populate('lastMessage')

  return chatLogs
}
