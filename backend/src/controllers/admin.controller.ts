import { UserRole } from "@prisma/client";
import prisma from "../lib/prisma";
import { adminCreateUserSchema, userLoginSchema, userFilterSchema } from "../models/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export const registerAdmin = asyncHandler(async (req, res) => {
    const result = adminCreateUserSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(200).json(
            {
                error: result.error.format()
            }
        )
    }
    const { name, email, password, address } = result.data;

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            address,
            role: "SYSTEM_ADMIN"
        },
        select: {
            id: true,
            name: true,
            email: true,
            address: true,
            role: true,
            createdAt: true
        }
    });

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    await prisma.user.update({
        where: { id: user.id },
        data: { refreshToken }
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(201).json(
        new ApiResponse(201, {
            user,
            accessToken,
            refreshToken
        }, "Admin registered successfully")
    );
});

export const loginAdmin = asyncHandler(async (req, res) => {
    const result = userLoginSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(200).json(
            {
                error: result.error.format()
            }
        )
    }
    const { email, password } = result.data;

    const admin = await prisma.user.findUnique({
        where: { email }
    });

    if (!admin || admin.role !== UserRole.SYSTEM_ADMIN) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordCorrect = await bcrypt.compare(password, admin.password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid email or password");
    }

    const accessToken = generateAccessToken(admin.id);
    const refreshToken = generateRefreshToken(admin.id);

    await prisma.user.update({
        where: { id: admin.id },
        data: { refreshToken }
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const userResponse = {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        address: admin.address,
        role: admin.role,
        createdAt: admin.createdAt
    };

    res.status(200).json(
        new ApiResponse(200, {
            user: userResponse,
            accessToken,
            refreshToken
        }, "Login successful")
    );
});

export const getAdminDashboard = asyncHandler(async (req, res) => {
    const user = (req as any).user;

    if (!user || user.role !== UserRole.SYSTEM_ADMIN) {
        throw new ApiError(403, "Only system administrators can access dashboard");
    }

    const [totalUsers, totalStores, totalRatings, recentUsers] = await Promise.all([
        prisma.user.count(),
        prisma.store.count(),
        prisma.rating.count(),
        prisma.user.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        })
    ]);

    const usersByRole = await prisma.user.groupBy({
        by: ['role'],
        _count: {
            role: true
        }
    });

    const dashboardData = {
        statistics: {
            totalUsers,
            totalStores,
            totalRatings,
            usersByRole: usersByRole.reduce((acc, item) => {
                acc[item.role] = item._count.role;
                return acc;
            }, {} as Record<string, number>)
        },
        recentUsers
    };

    res.status(200).json(
        new ApiResponse(200, dashboardData, "Admin dashboard data retrieved successfully")
    );
});

export const getAllUsers = asyncHandler(async (req, res) => {
    const user = (req as any).user;

    if (!user || user.role !== UserRole.SYSTEM_ADMIN) {
        throw new ApiError(403, "Only system administrators can view users");
    }

    const result = userFilterSchema.safeParse(req.query);
    if (!result.success) {
        return res.status(400).json(
            {
                error: result.error.format()
            }
        )
    }
    const { name, email, role, sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10 } = result.data;

    const where: any = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (email) where.email = { contains: email, mode: 'insensitive' };
    if (role) where.role = role;

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
        prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                address: true,
                role: true,
                createdAt: true,
                store: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: { [sortBy]: sortOrder },
            skip,
            take: limit
        }),
        prisma.user.count({ where })
    ]);

    const totalPages = Math.ceil(total / limit);

    res.status(200).json(
        new ApiResponse(200, {
            users,
            pagination: { page, limit, total, totalPages }
        }, "Users retrieved successfully")
    );
});

export const createUser = asyncHandler(async (req, res) => {
    const user = (req as any).user;

    if (!user || user.role !== UserRole.SYSTEM_ADMIN) {
        throw new ApiError(403, "Only system administrators can create users");
    }

    const result = adminCreateUserSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json(
            {
                error: result.error.format()
            }
        )
    }

    const { name, email, password, address } = result.data;
    const { role = 'NORMAL_USER' } = req.body;

    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    if (existingUser) {
        throw new ApiError(409, "User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
            address,
            role: role as UserRole
        },
        select: {
            id: true,
            name: true,
            email: true,
            address: true,
            role: true,
            createdAt: true
        }
    });

    res.status(201).json(
        new ApiResponse(201, newUser, "User created successfully")
    );
});

export const updateUserRole = asyncHandler(async (req, res) => {
    const user = (req as any).user;
    const { userId } = req.params;
    const { role } = req.body;

    if (!user || user.role !== UserRole.SYSTEM_ADMIN) {
        throw new ApiError(403, "Only system administrators can update user roles");
    }

    if (!userId || !role) {
        throw new ApiError(400, "User ID and role are required");
    }

    if (!Object.values(UserRole).includes(role)) {
        throw new ApiError(400, "Invalid role specified");
    }

    const existingUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, role: true }
    });

    if (!existingUser) {
        throw new ApiError(404, "User not found");
    }

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { role },
        select: {
            id: true,
            name: true,
            email: true,
            address: true,
            role: true,
            createdAt: true
        }
    });

    res.status(200).json(
        new ApiResponse(200, updatedUser, "User role updated successfully")
    );
});

export const deleteUser = asyncHandler(async (req, res) => {
    const user = (req as any).user;
    const { userId } = req.params;

    if (!user || user.role !== UserRole.SYSTEM_ADMIN) {
        throw new ApiError(403, "Only system administrators can delete users");
    }

    if (!userId) {
        throw new ApiError(400, "User ID is required");
    }

    if (userId === user.id) {
        throw new ApiError(400, "Cannot delete your own account");
    }

    const existingUser = await prisma.user.findUnique({
        where: { id: userId },
        include: {
            store: true,
            ratings: true
        }
    });

    if (!existingUser) {
        throw new ApiError(404, "User not found");
    }

    await prisma.$transaction(async (tx) => {
        if (existingUser.ratings.length > 0) {
            await tx.rating.deleteMany({
                where: { userId }
            });
        }

        if (existingUser.store) {
            await tx.store.delete({
                where: { id: existingUser.store.id }
            });
        }

        await tx.user.delete({
            where: { id: userId }
        });
    });

    res.status(200).json(
        new ApiResponse(200, null, "User deleted successfully")
    );
});
