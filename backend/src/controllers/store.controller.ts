import { UserRole } from "@prisma/client";
import prisma from "../lib/prisma";
import { storeCreateSchema, storeUpdateSchema, storeFilterSchema } from "../models/store.model";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { buildStoreWhereClause, buildPaginationQuery } from "../utils/database";

// Helper function to calculate average rating
const calculateAverageRating = (ratings: Array<{ rating: number }>): number => {
    if (!ratings || ratings.length === 0) return 0;
    const sum = ratings.reduce((acc, r) => acc + r.rating, 0);
    return Math.round((sum / ratings.length) * 10) / 10;
};

/**
 * Admin: Create a new store
 */
export const createStore = asyncHandler(async (req, res) => {
    const user = (req as any).user;

    if (!user || user.role !== UserRole.SYSTEM_ADMIN) {
        throw new ApiError(403, "Only system administrators can create stores");
    }

    const result = storeCreateSchema.safeParse(req.body);
    if (!result.success) {
        console.log('Store creation validation failed:', result.error);
        return res.status(400).json(
            {
                error: result.error.format()
            }
        );
    }

    const { name, email, address, ownerId } = result.data;

    console.log('Creating store with data:', { name, email, address, ownerId });

    // Check if store with email already exists and verify owner exists
    const [existingStore, ownerExists] = await Promise.all([
        prisma.store.findUnique({
            where: { email },
            select: { id: true, name: true }
        }),
        prisma.user.findUnique({
            where: { id: ownerId },
            select: { id: true, name: true, email: true, role: true, store: { select: { id: true, name: true } } }
        })
    ]);

    console.log('Existing store check:', existingStore);
    console.log('Owner exists check:', ownerExists);

    if (existingStore) {
        console.log('Conflict: Store email already exists');
        throw new ApiError(409, `A store with email "${email}" already exists (Store: ${existingStore.name})`);
    }

    if (!ownerExists) {
        console.log('Error: Owner not found');
        throw new ApiError(404, "Selected owner not found in database");
    }

    if (ownerExists.store) {
        console.log('Conflict: User already owns a store');
        throw new ApiError(409, `User "${ownerExists.name}" already owns a store: "${ownerExists.store.name}"`);
    }

    // Create store and update user role in a transaction
    const store = await prisma.$transaction(async (tx) => {
        const newStore = await tx.store.create({
            data: { name, email, address, ownerId },
            include: {
                owner: {
                    select: { id: true, name: true, email: true }
                }
            }
        });

        // Update user role to STORE_OWNER if not already
        if (ownerExists.role !== UserRole.STORE_OWNER) {
            await tx.user.update({
                where: { id: ownerId },
                data: { role: UserRole.STORE_OWNER }
            });
        }

        return newStore;
    });

    res.status(201).json(
        new ApiResponse(201, store, "Store created successfully")
    );
});

/**
 * Admin: Update store details
 */
export const updateStore = asyncHandler(async (req, res) => {
    const user = (req as any).user;
    const { id } = req.params;

    if (!user || user.role !== UserRole.SYSTEM_ADMIN) {
        throw new ApiError(403, "Only system administrators can update stores");
    }

    if (!id) {
        throw new ApiError(400, "Store ID is required");
    }

    const result = storeUpdateSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(200).json(
            {
                error: result.error.format()
            }
        )
    }

    const updateData = result.data;

    // Check if store exists
    const existingStore = await prisma.store.findUnique({
        where: { id },
        select: { id: true, email: true }
    });

    if (!existingStore) {
        throw new ApiError(404, "Store not found");
    }

    // If email is being updated, check for conflicts
    if (updateData.email && updateData.email !== existingStore.email) {
        const emailConflict = await prisma.store.findUnique({
            where: { email: updateData.email },
            select: { id: true }
        });

        if (emailConflict) {
            throw new ApiError(409, "Store with this email already exists");
        }
    }

    // Update store
    const updatedStore = await prisma.store.update({
        where: { id },
        data: updateData,
        include: {
            owner: {
                select: { id: true, name: true, email: true }
            }
        }
    });

    res.status(200).json(
        new ApiResponse(200, updatedStore, "Store updated successfully")
    );
});

/**
 * Get all stores with filtering, sorting, and pagination
 */
export const getAllStores = asyncHandler(async (req, res) => {
    const result = storeFilterSchema.safeParse(req.query);
    if (!result.success) {
        return res.status(200).json(
            {
                error: result.error.format()
            }
        )
    }

    const { name, address, email, sortBy, sortOrder, page = 1, limit = 10 } = result.data;

    // Build where clause
    const where = buildStoreWhereClause({ name, address, email });
    const pagination = buildPaginationQuery(page, limit);

    // Build query options
    const queryOptions: any = {
        where,
        include: {
            owner: {
                select: { id: true, name: true, email: true }
            },
            ratings: {
                select: { rating: true }
            }
        },
        skip: pagination.skip,
        take: pagination.take
    };

    // Add sorting
    if (sortBy && sortBy !== 'rating') {
        queryOptions.orderBy = { [sortBy]: sortOrder || 'asc' };
    }

    // Get stores and count
    const [stores, total] = await Promise.all([
        prisma.store.findMany(queryOptions),
        prisma.store.count({ where })
    ]);

    // Format response with ratings
    const formattedStores = stores.map((store: any) => {
        const { ratings, ...storeData } = store;
        return {
            ...storeData,
            averageRating: calculateAverageRating(ratings || []),
            totalRatings: ratings ? ratings.length : 0
        };
    });

    // Sort by rating if requested
    if (sortBy === 'rating') {
        formattedStores.sort((a, b) => {
            return sortOrder === 'desc'
                ? b.averageRating - a.averageRating
                : a.averageRating - b.averageRating;
        });
    }

    const totalPages = Math.ceil(total / limit);

    res.status(200).json(
        new ApiResponse(200, {
            stores: formattedStores,
            pagination: { page, limit, total, totalPages }
        }, "Stores retrieved successfully")
    );
});

/**
 * Get store by ID with ratings
 */
export const getStoreById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ApiError(400, "Store ID is required");
    }

    const store = await prisma.store.findUnique({
        where: { id },
        include: {
            owner: {
                select: { id: true, name: true, email: true }
            },
            ratings: {
                select: {
                    id: true,
                    rating: true,
                    createdAt: true,
                    user: {
                        select: { id: true, name: true }
                    }
                }
            }
        }
    });

    if (!store) {
        throw new ApiError(404, "Store not found");
    }

    const formattedStore = {
        ...store,
        averageRating: calculateAverageRating(store.ratings),
        totalRatings: store.ratings.length
    };

    res.status(200).json(
        new ApiResponse(200, formattedStore, "Store retrieved successfully")
    );
});

/**
 * Store Owner: Get own store dashboard data
 */
export const getStoreOwnerDashboard = asyncHandler(async (req, res) => {
    const user = (req as any).user;

    if (!user || user.role !== UserRole.STORE_OWNER) {
        throw new ApiError(403, "Only store owners can access dashboard");
    }

    // Get store owned by user
    const store = await prisma.store.findUnique({
        where: { ownerId: user.id },
        include: {
            ratings: {
                select: {
                    id: true,
                    rating: true,
                    createdAt: true,
                    user: {
                        select: { id: true, name: true, email: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            }
        }
    });

    if (!store) {
        throw new ApiError(404, "No store found for this user");
    }

    // Calculate dashboard statistics
    const averageRating = calculateAverageRating(store.ratings);
    const totalRatings = store.ratings.length;
    const ratingDistribution = {
        5: store.ratings.filter(r => r.rating === 5).length,
        4: store.ratings.filter(r => r.rating === 4).length,
        3: store.ratings.filter(r => r.rating === 3).length,
        2: store.ratings.filter(r => r.rating === 2).length,
        1: store.ratings.filter(r => r.rating === 1).length
    };

    const dashboardData = {
        store: {
            id: store.id,
            name: store.name,
            email: store.email,
            address: store.address,
            createdAt: store.createdAt
        },
        statistics: {
            averageRating,
            totalRatings,
            ratingDistribution
        },
        recentRatings: store.ratings.slice(0, 10),
        customers: store.ratings.map(r => r.user)
    };

    res.status(200).json(
        new ApiResponse(200, dashboardData, "Store dashboard data retrieved successfully")
    );
});

/**
 * Admin: Delete store
 */
export const deleteStore = asyncHandler(async (req, res) => {
    const user = (req as any).user;
    const { id } = req.params;

    if (!user || user.role !== UserRole.SYSTEM_ADMIN) {
        throw new ApiError(403, "Only system administrators can delete stores");
    }

    if (!id) {
        throw new ApiError(400, "Store ID is required");
    }

    // Check if store exists
    const store = await prisma.store.findUnique({
        where: { id },
        select: { id: true, ownerId: true }
    });

    if (!store) {
        throw new ApiError(404, "Store not found");
    }

    // Delete store and update owner role in transaction
    await prisma.$transaction(async (tx) => {
        // Delete the store (ratings will be deleted due to cascade)
        await tx.store.delete({ where: { id } });

        // Update owner role back to NORMAL_USER
        await tx.user.update({
            where: { id: store.ownerId },
            data: { role: UserRole.NORMAL_USER }
        });
    });

    res.status(200).json(
        new ApiResponse(200, null, "Store deleted successfully")
    );
});

/**
 * Normal User: Search stores by name and address
 */
export const searchStores = asyncHandler(async (req, res) => {
    const { query, page = 1, limit = 10 } = req.query;

    if (!query || typeof query !== 'string') {
        throw new ApiError(400, "Search query is required");
    }

    const searchQuery = query.trim();
    if (searchQuery.length < 2) {
        throw new ApiError(400, "Search query must be at least 2 characters");
    }

    // Build search where clause
    const where = {
        OR: [
            {
                name: {
                    contains: searchQuery,
                    mode: 'insensitive' as const
                }
            },
            {
                address: {
                    contains: searchQuery,
                    mode: 'insensitive' as const
                }
            }
        ]
    };

    // Build pagination
    const pagination = buildPaginationQuery(Number(page), Number(limit));

    // Search stores
    const [stores, total] = await Promise.all([
        prisma.store.findMany({
            where,
            include: {
                owner: {
                    select: { id: true, name: true, email: true }
                },
                ratings: {
                    select: { rating: true }
                }
            },
            ...pagination,
            orderBy: { name: 'asc' }
        }),
        prisma.store.count({ where })
    ]);

    // Format response with ratings
    const formattedStores = stores.map((store: any) => {
        const { ratings, ...storeData } = store;
        return {
            ...storeData,
            averageRating: calculateAverageRating(ratings || []),
            totalRatings: ratings ? ratings.length : 0
        };
    });

    const totalPages = Math.ceil(total / Number(limit));

    res.status(200).json(
        new ApiResponse(200, {
            stores: formattedStores,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages
            },
            searchQuery
        }, "Store search completed successfully")
    );
});