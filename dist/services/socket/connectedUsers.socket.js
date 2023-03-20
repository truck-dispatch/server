"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeConnectedUser = exports.addConnectedUser = exports.getConnectedUserSocketByUserId = exports.connectedUsers = void 0;
exports.connectedUsers = {};
function getConnectedUserSocketByUserId(userId) {
    return exports.connectedUsers[userId];
}
exports.getConnectedUserSocketByUserId = getConnectedUserSocketByUserId;
function addConnectedUser(userId, userSocketId) {
    exports.connectedUsers[userId] = userSocketId;
}
exports.addConnectedUser = addConnectedUser;
function removeConnectedUser(socketId) {
    const key = Object.keys(exports.connectedUsers).find((userId) => exports.connectedUsers[userId] === socketId);
    if (key)
        delete exports.connectedUsers[key];
}
exports.removeConnectedUser = removeConnectedUser;
//# sourceMappingURL=connectedUsers.socket.js.map