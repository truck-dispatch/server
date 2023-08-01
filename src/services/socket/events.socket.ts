import Bid from "@interfaces/Bid"
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
export function emitRemoveTrip(io: any, receiverId: string, tripId: string) {
  io?.to(receiverId).emit('remove-trip', tripId)
}
export function emitBidDetails(io: any, receiverId: string, bid: Bid) {
  io?.to(receiverId).emit('bid-details', bid)
}
export function emitRemoveBid(io: any, receiverId: string, bidId: string) {
  io?.to(receiverId).emit('remove-bid', bidId)
}