"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const body_parser_1 = __importDefault(require("body-parser"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const rateLimit_1 = __importDefault(require("./config/rateLimit"));
require("./data/db");
const cors_1 = __importDefault(require("./config/cors"));
const privateKeys_1 = require("./common/privateKeys");
const app = (0, express_1.default)();
const rateLimiter = (0, express_rate_limit_1.default)(rateLimit_1.default);
app.set('trust proxy', rateLimit_1.default.numberOfProxies);
app.use('/api', rateLimiter);
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(body_parser_1.default.urlencoded({
    limit: '50mb',
    extended: true,
}));
/*                                                                                        *
 * Cors is enabled so the client can acces enpoint on this API wthout having to make request *
 *  from the same Origin
 */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', cors_1.default.origins);
    res.header('Access-Control-Allow-Headers', cors_1.default.headers);
    if (req.method === 'OPTIONS') {
        // preflight request
        res.header('Access-Control-Allow-Methods', cors_1.default.methods);
        return res.status(200).json({});
    }
    next();
    return true;
});
// error handler
const errorHandler = (err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
    next();
};
app.use(errorHandler);
app.get('/api/v0.1', (_, res) => {
    res.status(200).send();
});
// catch 404 and forward to error handler
app.use((req, res) => res.status(404).json({
    error: true,
    msg: 'you seem to be lost',
}));
app.listen(privateKeys_1.PORT, () => console.log(`Running on port ${privateKeys_1.PORT}`));
//# sourceMappingURL=index.js.map