"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const chat_controller_1 = __importDefault(require("../controllers/chat.controller"));
const chat_middlewares_1 = __importDefault(require("../middlewares/chat.middlewares"));
const router = (0, express_1.Router)();
router.post('/', chat_middlewares_1.default.checkDataForCreateMessage, chat_controller_1.default.createChat);
router.get('/user/:userId', chat_middlewares_1.default.userIdExistsInParam, chat_controller_1.default.getChatsByUserId);
exports.default = router;
//# sourceMappingURL=chat.routes.js.map