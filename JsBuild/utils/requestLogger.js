"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requestLogger = (req, res, next) => {
    const requestStr = `${req.method} - ${req.url}`;
    console.log(`+${'-'.repeat(requestStr.length + 2)}+`);
    console.log(`| ${requestStr} |`);
    console.log(`+${'-'.repeat(requestStr.length + 2)}+`);
    console.log('body: ');
    console.log(req.body);
    console.log('x -----------------------');
    next();
};
exports.default = requestLogger;
