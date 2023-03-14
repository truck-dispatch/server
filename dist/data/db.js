"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const privateKeys_1 = require("../common/privateKeys");
const options = {
// useNewUrlParser: true,
// useUnifiedTopology: true,
};
mongoose_1.default.connect(privateKeys_1.MONGO_DB_URL, options).then(() => {
    console.log("database connected successfully");
});
//# sourceMappingURL=db.js.map