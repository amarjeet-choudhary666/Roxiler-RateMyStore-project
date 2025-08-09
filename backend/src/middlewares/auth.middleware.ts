/// <reference path="../types/express.d.ts" />


import prisma from "../lib/prisma";
import { ApiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { verifyAccessToken } from "../utils/jwt";

export const authMiddleware = asyncHandler(async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ApiError(401, "Authorization header is required");
    }

    const token = authHeader.split(" ")[1];

    try {
        const decodedToken = verifyAccessToken(token) as { userId: string };

        const existingUser = await prisma.user.findUnique({
            where: { id: decodedToken.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true
            },
        });

        if (!existingUser) {
            throw new ApiError(401, "User not found");
        }

        req.user = existingUser; 
        next();
    } catch (error) {
        return next(new ApiError(401, "Invalid or expired access token"));
    }
});