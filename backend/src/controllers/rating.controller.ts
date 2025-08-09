import { UserRole } from "@prisma/client";
import prisma from "../lib/prisma";
import { ratingCreateSchema, ratingUpdateSchema } from "../models/rating.model";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";

export const submitRating = asyncHandler(async (req, res) => {
    const user = (req as any).user;
    
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }

    if (user.role !== UserRole.NORMAL_USER) {
        throw new ApiError(403, "Only normal users can submit ratings");
    }

    const userId = user.id;

    const result = ratingCreateSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json(
            {
                error: result.error.format()
            }
        );
    }

    const { rating, storeId } = result.data;

    const store = await prisma.store.findUnique({
        where: { id: storeId },
        select: { id: true, name: true }
    });

    if (!store) {
        throw new ApiError(404, "Store not found");
    }

    const existingRating = await prisma.rating.findUnique({
        where: {
            userId_storeId: {
                userId,
                storeId
            }
        }
    });

    if (existingRating) {
        throw new ApiError(409, "You have already rated this store. Use update instead.");
    }

    const newRating = await prisma.rating.create({
        data: {
            rating,
            userId,
            storeId
        },
        include: {
            store: {
                select: {
                    name: true
                }
            }
        }
    });

    res.status(201).json(
        new ApiResponse(201, newRating, "Rating submitted successfully")
    );
});

export const updateRating = asyncHandler(async (req, res) => {
    const user = (req as any).user;
    const { ratingId } = req.params;
    
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }

    if (user.role !== UserRole.NORMAL_USER) {
        throw new ApiError(403, "Only normal users can update ratings");
    }

    const userId = user.id;

    if (!ratingId) {
        throw new ApiError(400, "Rating ID is required");
    }

    const result = ratingUpdateSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json(
            {
                error: result.error.format()
            }
        );
    }
    const { rating } = result.data;

    const existingRating = await prisma.rating.findUnique({
        where: { id: ratingId },
        include: {
            store: {
                select: { name: true }
            }
        }
    });

    if (!existingRating) {
        throw new ApiError(404, "Rating not found");
    }

    if (existingRating.userId !== userId) {
        throw new ApiError(403, "You can only update your own ratings");
    }

    const updatedRating = await prisma.rating.update({
        where: { id: ratingId },
        data: { rating },
        include: {
            store: {
                select: { name: true }
            }
        }
    });

    res.status(200).json(
        new ApiResponse(200, updatedRating, "Rating updated successfully")
    );
});

export const getUserRatings = asyncHandler(async (req, res) => {
    const user = (req as any).user;
    
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }

    if (user.role !== UserRole.NORMAL_USER) {
        throw new ApiError(403, "Only normal users can view their ratings");
    }

    const userId = user.id;

    const ratings = await prisma.rating.findMany({
        where: { userId },
        include: {
            store: {
                select: {
                    id: true,
                    name: true,
                    address: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    res.status(200).json(
        new ApiResponse(200, ratings, "User ratings retrieved successfully")
    );
});

export const getStoreRatings = asyncHandler(async (req, res) => {
    const user = (req as any).user;
    
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }

    if (user.role !== UserRole.STORE_OWNER) {
        throw new ApiError(403, "Only store owners can view store ratings");
    }

    const userId = user.id;

    const store = await prisma.store.findUnique({
        where: { ownerId: userId },
        select: { id: true }
    });

    if (!store) {
        throw new ApiError(404, "No store found for this user");
    }

    const ratings = await prisma.rating.findMany({
        where: { storeId: store.id },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const averageRating = ratings.length > 0 
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length 
        : 0;

    res.status(200).json(
        new ApiResponse(200, {
            ratings,
            averageRating: Math.round(averageRating * 10) / 10,
            totalRatings: ratings.length
        }, "Store ratings retrieved successfully")
    );
});

export const getUserStoreRating = asyncHandler(async (req, res) => {
    const user = (req as any).user;
    const { storeId } = req.params;
    
    if (!user) {
        throw new ApiError(401, "Unauthorized");
    }

    if (user.role !== UserRole.NORMAL_USER) {
        throw new ApiError(403, "Only normal users can check their store ratings");
    }

    const userId = user.id;

    if (!storeId) {
        throw new ApiError(400, "Store ID is required");
    }

    const rating = await prisma.rating.findUnique({
        where: {
            userId_storeId: {
                userId,
                storeId
            }
        },
        include: {
            store: {
                select: {
                    name: true
                }
            }
        }
    });

    res.status(200).json(
        new ApiResponse(200, rating, "User store rating retrieved successfully")
    );
});
