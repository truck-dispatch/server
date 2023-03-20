"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectSocket = void 0;
const connectedUsers_socket_1 = require("./connectedUsers.socket");
function connectSocket(socket) {
    socket.on('join', ({ userId }) => {
        connectedUsers_socket_1.connectedUsers[userId] = socket.id;
    });
}
exports.connectSocket = connectSocket;
//# sourceMappingURL=connect.socket.js.map