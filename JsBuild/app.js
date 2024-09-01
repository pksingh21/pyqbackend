"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const errorController_1 = __importDefault(require("./controller/errorController"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const requestLogger_1 = __importDefault(require("./utils/requestLogger"));
const appError_1 = __importDefault(require("./utils/appError"));
const app = (0, express_1.default)();
app.use(express_1.default.static(path_1.default.join(__dirname, '../frontend/build')));
const whitelist = process.env.CORS_WHITELIST ? process.env.CORS_WHITELIST.split(',') : [];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use(requestLogger_1.default);
if (process.env.USE_CORS) {
    app.use((0, cors_1.default)(corsOptions));
}
app.use('/api/auth', authRoutes_1.default);
app.use('/api/user', userRoutes_1.default);
// Serve the React frontend
app.get('*', (req, res) => {
    res.sendFile(path_1.default.join(__dirname, '../frontend/build', 'index.html'));
});
// Handle undefined routes
app.all('*', (req, res, next) => {
    next(new appError_1.default(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(errorController_1.default);
exports.default = app;
