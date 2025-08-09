"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ratingFilterSchema = exports.ratingUpdateSchema = exports.ratingCreateSchema = void 0;
const zod_1 = require("zod");
exports.ratingCreateSchema = zod_1.z.object({
    rating: zod_1.z
        .number()
        .int('Rating must be an integer')
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating must be at most 5'),
    storeId: zod_1.z.string().min(1, 'Store ID is required'),
});
exports.ratingUpdateSchema = zod_1.z.object({
    rating: zod_1.z
        .number()
        .int('Rating must be an integer')
        .min(1, 'Rating must be at least 1')
        .max(5, 'Rating must be at most 5'),
});
exports.ratingFilterSchema = zod_1.z.object({
    storeId: zod_1.z.string().optional(),
    userId: zod_1.z.string().optional(),
    rating: zod_1.z.number().min(1).max(5).optional(),
    sortBy: zod_1.z.enum(['rating', 'createdAt', 'updatedAt']).optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional(),
    page: zod_1.z.number().min(1).optional(),
    limit: zod_1.z.number().min(1).max(100).optional(),
});
