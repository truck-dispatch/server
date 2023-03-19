"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    windowMs: 2 * 60 * 1000,
    max: 400,
    // Response JSON when over the max requests per window
    message: {
        data: [],
        error: true,
        msg: 'Too many requests. Please try again later.',
    },
    statusCode: 429,
    standardHeaders: true,
    legacyHeaders: false,
    /*
     * Number of proxies you are behind.  If behind a load balancer or other proxy, increment this
     * by the number of proxies.  Failure to do so will result in the load balancer / proxy IP being
     * rate-limited.
     *
     * NOT PART OF express-rate-limit.  Sets the Express 'trust proxy' value in app.js:22
     */
    numberOfProxies: 0,
};
//# sourceMappingURL=rateLimit.js.map