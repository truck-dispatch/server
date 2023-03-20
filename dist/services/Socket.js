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
        console.log('connect is triggered', { io: this.io });
        this.io.on('connection', (socket) => {
            console.log('a user connected');
            socket.on('message', (message) => {
                const typedSocket = socket;
                console.log({ messageB: message });
                if (typedSocket.userId === message.senderId ||
                    typedSocket.userId === message.receiverId) {
                    socket.emit('message', message);
                    console.log({ message });
                }
            });
            socket.on('disconnect', () => {
                console.log('user disconnected');
            });
        });
        this.io.on('error', (err) => {
            console.log({ err });
        });
    }
}
exports.Socket = Socket;
//# sourceMappingURL=Socket.js.map