"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiServer = exports.ServerService = void 0;
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
class ServerService {
    createServer(app) {
        var _a;
        const server = http_1.default.createServer(app);
        ServerService._io = new socket_io_1.Server(server, {
            cors: {
                origin: '*',
            },
        });
        (_a = ServerService._io) === null || _a === void 0 ? void 0 : _a.on('connect', (socket) => {
            console.log('connected socket');
            socket.on('join', ({ userId }) => {
                ServerService._userId = userId;
            });
            socket.on('disconnect', () => { });
            socket.on('message', (message) => {
                var _a;
                if (ServerService._userId === message.receiverId ||
                    ServerService._userId === message.senderId) {
                    console.log(ServerService._userId, 'userId');
                    (_a = ServerService._io) === null || _a === void 0 ? void 0 : _a.emit('message', message);
                }
            });
        });
        return server;
    }
}
exports.ServerService = ServerService;
exports.ApiServer = new ServerService();
//# sourceMappingURL=Server.js.map