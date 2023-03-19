import { Server, Socket as TypedSocket } from 'socket.io'
import http from 'http'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import Chat from '../types/Chat'
import { FRONTEND_URL } from '../common/privateKeys'

interface CustomSocket extends TypedSocket {
  userId: string
}

let appIo: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>

class Socket {
  io: Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>

  constructor(
    server: http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>
  ) {
    this.io = new Server(server, {
      cors: {
        origin: '*',
      },
    })
    appIo = this.io
  }

  connect() {
    this.io.on('connection', (socket) => {
      console.log('a user connected')
      socket.on('message', (message: Chat) => {
        const typedSocket = socket as CustomSocket
        if (
          typedSocket.userId === message.senderId ||
          typedSocket.userId === message.receiverId
        ) {
          socket.emit('message', message)
        }
      })
      socket.on('disconnect', () => {
        console.log('user disconnected')
      })
    })
  }
}

export { appIo, Socket }
