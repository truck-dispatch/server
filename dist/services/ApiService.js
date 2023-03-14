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
const axios_1 = __importDefault(require("axios"));
/**
 * ApiService Class
 */
class ApiService {
    /**
     * constructor function
     * @param {String} baseUrl API base URL
     */
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.api = axios_1.default.create({
            baseURL: baseUrl,
            timeout: 40000,
        });
    }
    /**
     * fetch data from endpoint
     * @param {String} endpoint url endpoint to access
     */
    getData(endpoint) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.api.get(endpoint);
            return response.data;
        });
    }
}
exports.default = ApiService;
//# sourceMappingURL=ApiService.js.map