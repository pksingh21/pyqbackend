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
exports.protect = exports.logout = exports.getLoginStatus = exports.login = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
dotenv_1.default.config();
const prisma = new client_1.PrismaClient();
// verify jwt
const protect = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies['auth_token'];
    console.log({ token });
    if (!token)
        return next(new appError_1.default('A token is required for authentication', 403));
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
    }
    catch (err) {
        return next(new appError_1.default('Invalid token', 401));
    }
    return next();
}));
exports.protect = protect;
const login = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        return next(new appError_1.default('Invalid credentials', 401));
    }
    if (bcryptjs_1.default.compareSync(password, user.password)) {
        const token = jsonwebtoken_1.default.sign({ email }, process.env.JWT_SECRET_KEY, {
            expiresIn: '1h',
        });
        res.cookie('auth_token', token, {
            httpOnly: true,
            maxAge: 3600000,
            secure: process.env.NODE_ENV === 'production',
        });
        res.status(200).json({ message: 'Logged in successfully', user });
    }
    else {
        return next(new appError_1.default('Invalid credentials', 401));
    }
}));
exports.login = login;
const getLoginStatus = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log({ user: req.user });
    res.status(200).send({ message: 'Already logged in!', user: req.user });
}));
exports.getLoginStatus = getLoginStatus;
const logout = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.cookie('auth_token', 'loggedout', {
        httpOnly: true,
        expires: new Date(0),
        secure: process.env.NODE_ENV === 'production',
    });
    res.status(200).send({ message: 'Logged out successfully' });
}));
exports.logout = logout;
