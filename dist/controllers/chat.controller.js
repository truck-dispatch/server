"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chat_model_1 = require("../data/models/chat.model");
const Respond_1 = __importDefault(require("../helpers/Respond"));
const connectedUsers_socket_1 = require("../services/socket/connectedUsers.socket");
class ChatController {
    createChat(req, res, next) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { message, senderId, receiverId, transporterId, agentId, chatId } = req.body;
                const messageToSave = new chat_model_1.ChatSchema({
                    message,
                    senderId,
                    receiverId,
                    transporterId,
                    agentId,
                    chatId,
                });
                yield messageToSave.save();
                const receiverSocket = (0, connectedUsers_socket_1.getConnectedUserSocketByUserId)(messageToSave.receiverId);
                if (receiverSocket) {
                    // @ts-ignore
                    (_a = global.io) === null || _a === void 0 ? void 0 : _a.to(receiverSocket).emit('message', messageToSave);
                }
                return Respond_1.default.success(res, 'Message created successfully.', messageToSave);
            }
            catch (err) {
                return next(err);
            }
        });
    }
    getChatsByUserId(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const chatsSentByMe = yield chat_model_1.ChatSchema.find({ senderId: userId });
                const chatsSentToMe = yield chat_model_1.ChatSchema.find({ receiverId: userId });
                return Respond_1.default.success(res, 'Messages fetched successfully', [
                    ...chatsSentByMe,
                    ...chatsSentToMe,
                ]);
            }
            catch (err) {
                next(err);
            }
        });
    }
    getChatsByChatId(req, res) { }
}
exports.default = new ChatController();
//# sourceMappingURL=chat.controller.js.map