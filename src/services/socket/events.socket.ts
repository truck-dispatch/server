import Trip from "@interfaces/Trip"

export function emitMessage(io: any, receiverId: string, data: unknown) {
  io?.to(receiverId).emit('message', data)
}
export function emitChatLog(io: any, receiverId: string, data: unknown) {
  io?.to(receiverId).emit('chat-log', data)
}
export function emitTripDetails(io: any, receiverId: string, data: Trip) {
  io?.to(receiverId).emit('trip-details', data)
}