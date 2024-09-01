"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sendErrorDev = (err, req, res) => {
    return res.status(err.statusCode || 500).json({ error: err });
};
const sendErrorProd = (err, req, res) => {
    if (err.isOperational) {
        return res.status(err.statusCode || 500).json({
            title: 'Something went wrong',
            msg: err.message,
        });
    }
    return res.status(500).json({
        title: 'Something went wrong',
        msg: 'Please try again later.',
    });
};
const globalErrorHandler = (err, req, res, next) => {
    console.error(err.stack);
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    if (process.env.NODE_ENV === 'production') {
        const error = Object.assign({}, err);
        sendErrorProd(error, req, res);
    }
    else {
        sendErrorDev(err, req, res);
    }
};
exports.default = globalErrorHandler;
