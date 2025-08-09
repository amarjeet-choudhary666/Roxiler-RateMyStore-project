import { $Enums } from '@prisma/client';
import { z } from 'zod';

export interface User {
  id: number;
  name: string;
  email: string;
  age?: number;
  role: UserRoleType;
  isActive: boolean;
}


export const UserRole = z.enum(['SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER']);

// User Validation Schemas
export const userSignupSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name must be at most 60 characters'),
  email: z.string().email('Invalid email format'),
  address: z
    .string()
    .max(400, 'Address must be at most 400 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must be at most 16 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

export const userLoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password required')
});

export const userUpdatePasswordSchema = z.object({
  currentPassword: z.string().min(8, 'Current password required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must be at most 16 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});


// User Filter Schema
export const userFilterSchema = z.object({
  name: z.string().optional(),
  email: z.string().optional(),
  address: z.string().optional(),
  role: UserRole.optional(),
  sortBy: z.enum(['name', 'email', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  page: z.coerce.number().min(1).optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
});

export const storeownerSignupSchema = z.object({
  name: z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(60, 'Name must be at most 60 characters'),
  email: z.string().email('Invalid email format'),
  address: z
  .string()
  .max(400, 'Address must be at most 400 characters'),
  password: z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(16, 'Password must be at most 16 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});
export const adminCreateUserSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(60, 'Name must be at most 60 characters'),
  email: z.string().email('Invalid email format'),
  address: z
    .string()
    .max(400, 'Address must be at most 400 characters'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must be at most 16 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

export const loginAdmin = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(16, 'Password must be at most 16 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

export type UserSignup = z.infer<typeof userSignupSchema>;
export type UserLogin = z.infer<typeof userLoginSchema>;
export type UserUpdatePassword = z.infer<typeof userUpdatePasswordSchema>;
export type AdminCreateUser = z.infer<typeof adminCreateUserSchema>;
export type UserFilter = z.infer<typeof userFilterSchema>;
export type UserRoleType = z.infer<typeof UserRole>;
export type ShopOwnerSignup = z.infer<typeof storeownerSignupSchema>; 
export type adminLoginSchema = z.infer<typeof loginAdmin>