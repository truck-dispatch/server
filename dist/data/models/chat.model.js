"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatSchema = void 0;
const mongoose_1 = require("mongoose");
const schema = new mongoose_1.Schema({
    chatId: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    senderId: {
        type: String,
        required: true,
    },
    receiverId: {
        type: String,
        required: true,
    },
    agentId: {
        type: String,
        required: true,
    },
    transporterId: {
        type: String,
        required: true,
    },
}, { timestamps: true });
exports.ChatSchema = (0, mongoose_1.model)('Chat', schema);
//# sourceMappingURL=chat.model.js.map