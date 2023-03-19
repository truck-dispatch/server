"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ChatController_1 = __importDefault(require("../controllers/ChatController"));
const ChatMiddlewares_1 = __importDefault(require("../middlewares/ChatMiddlewares"));
const router = (0, express_1.Router)();
router.post('/', ChatMiddlewares_1.default.checkDataForCreateMessage, ChatController_1.default.createChat);
router.get('/user/:userId', ChatMiddlewares_1.default.userIdExistsInParam, ChatController_1.default.getChatsByUserId);
exports.default = router;
//# sourceMappingURL=chat.js.map