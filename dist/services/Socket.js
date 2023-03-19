"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Socket = exports.appIo = void 0;
const socket_io_1 = require("socket.io");
let appIo;
exports.appIo = appIo;
class Socket {
    constructor(server) {
        this.io = new socket_io_1.Server(server, {
            cors: {
                origin: '*',
            },
        });
        exports.appIo = appIo = this.io;
    }
    connect() {
        this.io.on('connection', (socket) => {
            console.log('a user connected');
            socket.on('message', (message) => {
                const typedSocket = socket;
                if (typedSocket.userId === message.senderId ||
                    typedSocket.userId === message.receiverId) {
                    socket.emit('message', message);
                }
            });
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });
    }
}
exports.Socket = Socket;
//# sourceMappingURL=Socket.js.map