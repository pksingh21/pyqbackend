"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        // Set the prototype explicitly
        Object.setPrototypeOf(this, AppError.prototype);
        // Capture stack trace
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
