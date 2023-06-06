import { Types } from 'mongoose'

export const connectedUsers: Record<string, string> = {}

export function getConnectedUserSocketByUserId(
  userId: string | Types.ObjectId
) {
  return connectedUsers[userId as string]
}

export function addConnectedUser(userId: string, userSocketId: string) {
  connectedUsers[userId] = userSocketId
}

export function removeConnectedUser(socketId: string) {
  const key = Object.keys(connectedUsers).find(
    (userId) => connectedUsers[userId] === socketId
  )
  if (key) delete connectedUsers[key]
}
