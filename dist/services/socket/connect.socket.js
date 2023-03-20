"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectSocket = void 0;
const connectedUsers_socket_1 = require("./connectedUsers.socket");
function connectSocket(socket) {
    socket.on('join', ({ userId }) => {
        (0, connectedUsers_socket_1.addConnectedUser)(userId, socket.id);
    });
    socket.on('disconnect', () => {
        (0, connectedUsers_socket_1.removeConnectedUser)(socket.id);
    });
}
exports.connectSocket = connectSocket;
//# sourceMappingURL=connect.socket.js.map