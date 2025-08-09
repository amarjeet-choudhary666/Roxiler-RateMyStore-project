"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const apiError_1 = require("../utils/apiError");
const asyncHandler_1 = require("../utils/asyncHandler");
const jwt_1 = require("../utils/jwt");
exports.authMiddleware = (0, asyncHandler_1.asyncHandler)(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        throw new apiError_1.ApiError(401, "User is not authenticated");
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        throw new apiError_1.ApiError(401, "User is not authenticated");
    }
    try {
        const decodedToken = (0, jwt_1.verifyAccessToken)(token);
        const existingUser = await prisma_1.default.user.findUnique({
            where: {
                id: decodedToken.userId
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            },
        });
        if (!existingUser) {
            throw new apiError_1.ApiError(401, "user not found");
        }
        req.user = existingUser;
        next();
    }
    catch (error) {
        return next(new apiError_1.ApiError(401, "User is not authenticated"));
    }
});
