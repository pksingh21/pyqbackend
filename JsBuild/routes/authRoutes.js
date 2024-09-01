"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// authRoutes.ts
const express_1 = require("express");
const authController_1 = require("../controller/authController");
const router = (0, express_1.Router)();
// Public route
router.post('/login', authController_1.login);
// Protected routes
router.use(authController_1.protect);
router.get('/login-status', authController_1.getLoginStatus);
router.post('/logout', authController_1.logout);
exports.default = router;
