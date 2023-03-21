import { Socket } from 'socket.io'
import { addConnectedUser, removeConnectedUser } from './connectedUsers.socket'

export function connectSocket(socket: Socket) {
  socket.on('join', ({ userId }) => {
    addConnectedUser(userId, socket.id)
  })
  socket.on('disconnect', () => {
    removeConnectedUser(socket.id)
  })
}
