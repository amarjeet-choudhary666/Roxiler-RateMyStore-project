"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginShopOwner = exports.registerShopOwner = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const asyncHandler_1 = require("../utils/asyncHandler");
const models_1 = require("../models");
const prisma_1 = __importDefault(require("../lib/prisma"));
const jwt_1 = require("../utils/jwt");
exports.registerShopOwner = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = models_1.storeownerSignupSchema.safeParse(req.body);
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
    const user = await prisma_1.default.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            address,
            role: "STORE_OWNER"
        }
    });
    return res.status(201).json({
        message: "User registered successfully",
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
});
exports.loginShopOwner = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const shopOwner = await prisma_1.default.user.findUnique({
        where: { email }
    });
    if (!shopOwner || shopOwner.role !== "STORE_OWNER") {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordCorrect = await bcrypt_1.default.compare(password, shopOwner.password);
    if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    const accessToken = (0, jwt_1.generateAccessToken)(shopOwner.id);
    const refreshToken = (0, jwt_1.generateRefreshToken)(shopOwner.id);
    if (!accessToken || !refreshToken) {
        return res.status(500).json({ message: "Failed to generate tokens" });
    }
    await prisma_1.default.user.update({
        where: { id: shopOwner.id },
        data: {
            refreshToken
        }
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000
    });
    return res.status(200).json({
        message: "Login successful",
        user: { id: shopOwner.id, name: shopOwner.name, email: shopOwner.email, role: shopOwner.role },
        tokens: { accessToken, refreshToken }
    });
    return res.status(200).json({
        message: "Login successful",
        user: { id: shopOwner.id, name: shopOwner.name, email: shopOwner.email, role: shopOwner.role },
        tokens: { accessToken, refreshToken }
    });
});
