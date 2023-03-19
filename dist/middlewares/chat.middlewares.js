"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Respond_1 = __importDefault(require("../helpers/Respond"));
class ChatMiddlewares {
    checkDataForCreateMessage(req, res, next) {
        const { message, senderId, receiverId, transporterId, agentId, chatId } = req.body;
        if (!message)
            return Respond_1.default.error(res, 'Message was not provided', 400);
        if (!senderId)
            return Respond_1.default.error(res, 'Sender ID is required to send a message', 400);
        if (!receiverId)
            return Respond_1.default.error(res, 'Receiver ID is required to send a message', 400);
        if (!chatId)
            return Respond_1.default.error(res, 'Chat ID is required to send a message', 400);
        if (!transporterId || !agentId)
            return Respond_1.default.error(res, 'Agent and transporter ID is required to send a message', 400);
        return next();
    }
    userIdExistsInParam(req, res, next) {
        const { userId } = req.params;
        if (!userId)
            return Respond_1.default.error(res, 'User ID is a compulsory field');
        next();
    }
}
exports.default = new ChatMiddlewares();
//# sourceMappingURL=chat.middlewares.js.map