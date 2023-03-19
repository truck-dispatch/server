"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Respond_1 = __importDefault(require("../helpers/Respond"));
const chat_routes_1 = __importDefault(require("./chat.routes"));
const router = (0, express_1.Router)();
router.use('/chat', chat_routes_1.default);
/* GET home page. */
router.get('/', (req, res) => {
    return Respond_1.default.success(res, 'Welcome to truckdispatch API.');
});
exports.default = router;
//# sourceMappingURL=index.js.map