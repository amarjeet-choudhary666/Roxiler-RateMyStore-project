"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeFilterSchema = exports.storeUpdateSchema = exports.storeCreateSchema = void 0;
const zod_1 = require("zod");
exports.storeCreateSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, 'Store name is required')
        .max(100, 'Store name must be at most 100 characters'),
    email: zod_1.z.string().email('Invalid email format'),
    address: zod_1.z
        .string()
        .min(1, 'Address is required')
        .max(400, 'Address must be at most 400 characters'),
    ownerId: zod_1.z.string().min(1, 'Owner ID is required'),
});
exports.storeUpdateSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(1, 'Store name is required')
        .max(100, 'Store name must be at most 100 characters')
        .optional(),
    email: zod_1.z.string().email('Invalid email format').optional(),
    address: zod_1.z
        .string()
        .min(1, 'Address is required')
        .max(400, 'Address must be at most 400 characters')
        .optional(),
});
exports.storeFilterSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    address: zod_1.z.string().optional(),
    email: zod_1.z.string().optional(),
    sortBy: zod_1.z.enum(['name', 'email', 'createdAt', 'rating']).optional(),
    sortOrder: zod_1.z.enum(['asc', 'desc']).optional(),
    page: zod_1.z.number().min(1).optional(),
    limit: zod_1.z.number().min(1).max(100).optional(),
});
