import { z } from 'zod';

// Rating Validation Schemas
export const ratingCreateSchema = z.object({
  rating: z
    .number()
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
  storeId: z.string().min(1, 'Store ID is required'),
});

export const ratingUpdateSchema = z.object({
  rating: z
    .number()
    .int('Rating must be an integer')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),
});

// Rating Filter Schema (for admin/store owner views)
export const ratingFilterSchema = z.object({
  storeId: z.string().optional(),
  userId: z.string().optional(),
  rating: z.number().min(1).max(5).optional(),
  sortBy: z.enum(['rating', 'createdAt', 'updatedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

// Type exports
export type RatingCreate = z.infer<typeof ratingCreateSchema>;
export type RatingUpdate = z.infer<typeof ratingUpdateSchema>;
export type RatingFilter = z.infer<typeof ratingFilterSchema>;