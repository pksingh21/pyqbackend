"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// authRoutes.ts
const express_1 = require("express");
const userController_1 = require("../controller/userController");
const authController_1 = require("../controller/authController");
const router = (0, express_1.Router)();
// Public route
router.post('/', userController_1.createUser);
// Protected routes
router.use(authController_1.protect);
router.get('/:id', userController_1.getUser);
router.patch('/:id', userController_1.updateUser);
router.delete('/:id', userController_1.deleteUser);
exports.default = router;
