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
exports.deleteUser = exports.updateUser = exports.getUser = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const appError_1 = __importDefault(require("../utils/appError"));
const prisma = new client_1.PrismaClient();
// Create a new user
const createUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { phoneNumber, name, email, password } = req.body;
    const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
    const newUser = yield prisma.user.create({
        data: {
            phoneNumber,
            name,
            email,
            password: hashedPassword,
        },
    });
    res.status(201).json({
        status: 'success',
        data: {
            user: newUser,
        },
    });
}));
exports.createUser = createUser;
// Get a user by ID
const getUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const user = yield prisma.user.findUnique({
        where: { id: parseInt(id, 10) },
    });
    if (!user) {
        return next(new appError_1.default('User not found', 404));
    }
    res.status(200).json({
        status: 'success',
        data: {
            user,
        },
    });
}));
exports.getUser = getUser;
// Update a user by ID
const updateUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { phoneNumber, name, email, password } = req.body;
    const updatedData = { phoneNumber, name, email };
    if (password) {
        updatedData.password = yield bcryptjs_1.default.hash(password, 12);
    }
    const updatedUser = yield prisma.user.update({
        where: { id: parseInt(id, 10) },
        data: updatedData,
    });
    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser,
        },
    });
}));
exports.updateUser = updateUser;
// Delete a user by ID
const deleteUser = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    yield prisma.user.delete({
        where: { id: parseInt(id, 10) },
    });
    res.status(204).json({
        status: 'success',
        data: null,
    });
}));
exports.deleteUser = deleteUser;
