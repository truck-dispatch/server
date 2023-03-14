"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
/* GET home page. */
router.get('/', (req, res) => {
    res.render('index', { title: 'Truckdispatch Api' });
});
//# sourceMappingURL=index.js.map