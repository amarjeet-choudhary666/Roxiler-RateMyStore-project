"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.registeradmin = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const models_1 = require("../models");
const asyncHandler_1 = require("../utils/asyncHandler");
const bcrypt_1 = __importDefault(require("bcrypt"));
exports.registeradmin = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = models_1.adminCreateUserSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.issues });
    }
    const { name, email, password, address } = result.data;
    if (!name || !email || !password || !address) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await prisma_1.default.user.findUnique({
        where: { email }
    });
    if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const admin = await prisma_1.default.user.create({
        data: {
            name: name,
            email: email,
            address: address,
            password: hashedPassword,
            role: "SYSTEM_ADMIN"
        }
    });
    return res.status(201).json({
        message: " registered successfully",
        user: { id: admin.id, name: admin.name, email: admin.email, role: admin.role }
    });
});
