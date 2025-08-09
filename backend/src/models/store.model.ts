import { z } from 'zod';

// Store Validation Schemas
export const storeCreateSchema = z.object({
  name: z
    .string()
    .min(1, 'Store name is required')
    .max(100, 'Store name must be at most 100 characters'),
  email: z.string().email('Invalid email format'),
  address: z
    .string()
    .min(1, 'Address is required')
    .max(400, 'Address must be at most 400 characters'),
  ownerId: z.string().min(1, 'Owner ID is required'),
});

export const storeUpdateSchema = z.object({
  name: z
    .string()
    .min(1, 'Store name is required')
    .max(100, 'Store name must be at most 100 characters')
    .optional(),
  email: z.string().email('Invalid email format').optional(),
  address: z
    .string()
    .min(1, 'Address is required')
    .max(400, 'Address must be at most 400 characters')
    .optional(),
});

// Store Search/Filter Schema
export const storeFilterSchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  email: z.string().optional(),
  sortBy: z.enum(['name', 'email', 'createdAt', 'rating']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});



// Type exports
export type StoreCreate = z.infer<typeof storeCreateSchema>;
export type StoreUpdate = z.infer<typeof storeUpdateSchema>;
export type StoreFilter = z.infer<typeof storeFilterSchema>;