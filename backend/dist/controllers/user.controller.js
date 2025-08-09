"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const models_1 = require("../models");
const apiError_1 = require("../utils/apiError");
const asyncHandler_1 = require("../utils/asyncHandler");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jwt_1 = require("../utils/jwt");
exports.registerUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = models_1.userSignupSchema.safeParse(req.body);
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
            role: "NORMAL_USER"
        }
    });
    return res.status(201).json({
        message: "User registered successfully",
        user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
});
exports.loginUser = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const result = models_1.userLoginSchema.safeParse(req.body);
    if (!result.success) {
        throw new apiError_1.ApiError(400, "All fields are required", result.error.issues);
    }
    const { email, password } = result.data;
    if (!email || !password) {
        throw new apiError_1.ApiError(400, "All fields are required");
    }
    const user = await prisma_1.default.user.findUnique({
        where: { email }
    });
    if (!user || user.role !== "NORMAL_USER") {
        return res.status(401).json({ message: "Invalid email or password" });
    }
    if (!user) {
        throw new apiError_1.ApiError(404, "User not found");
    }
    const isPasswordCorrect = await bcrypt_1.default.compare(password, user.password);
    if (!isPasswordCorrect) {
        throw new apiError_1.ApiError(401, "Invalid email or password");
    }
    const accessToken = (0, jwt_1.generateAccessToken)(user.id);
    const refreshToken = (0, jwt_1.generateRefreshToken)(user.id);
    if (!accessToken || !refreshToken) {
        throw new apiError_1.ApiError(500, "Failed to generate tokens");
    }
    await prisma_1.default.user.update({
        where: {
            id: user.id
        },
        data: {
            refreshToken
        }
    });
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000
    });
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        maxAge: 24 * 60 * 60 * 1000
    });
    return res.status(200).json({
        message: "Login successful",
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
        tokens: { accessToken, refreshToken }
    });
});
