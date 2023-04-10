export function emitMessage(io: any, receiverId: string, data: unknown) {
  io?.to(receiverId).emit('message', data)
}
export function emitChatLog(io: any, receiverId: string, data: unknown) {
  io?.to(receiverId).emit('chat-log', data)
}
