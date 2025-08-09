import bcrypt from "bcrypt";
import { UserRole } from "@prisma/client";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { storeownerSignupSchema, userLoginSchema } from "../models/user.model";
import prisma from "../lib/prisma";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export const registerStoreOwner = asyncHandler(async (req, res) => {
    const result = storeownerSignupSchema.safeParse(req.body);

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
            role: "STORE_OWNER"
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
        }, "Store owner registered successfully")
    );
});

export const loginStoreOwner = asyncHandler(async (req, res) => {
    const result = userLoginSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(200).json(
            {
                error: result.error.format()
            }
        )
    }
    const { email, password } = result.data;

    const storeOwner = await prisma.user.findUnique({
        where: { email }
    });

    if (!storeOwner || storeOwner.role !== UserRole.STORE_OWNER) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordCorrect = await bcrypt.compare(password, storeOwner.password);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid email or password");
    }

    const accessToken = generateAccessToken(storeOwner.id);
    const refreshToken = generateRefreshToken(storeOwner.id);

    await prisma.user.update({
        where: { id: storeOwner.id },
        data: { refreshToken }
    });

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    const userResponse = {
        id: storeOwner.id,
        name: storeOwner.name,
        email: storeOwner.email,
        address: storeOwner.address,
        role: storeOwner.role,
        createdAt: storeOwner.createdAt
    };

    res.status(200).json(
        new ApiResponse(200, { 
            user: userResponse, 
            accessToken, 
            refreshToken 
        }, "Login successful")
    );
});

export const getStoreOwnerProfile = asyncHandler(async (req, res) => {
    const user = (req as any).user;

    if (!user || user.role !== UserRole.STORE_OWNER) {
        throw new ApiError(403, "Only store owners can access this endpoint");
    }

    const storeOwner = await prisma.user.findUnique({
        where: { id: user.id },
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
                    name: true,
                    email: true,
                    address: true,
                    createdAt: true
                }
            }
        }
    });

    if (!storeOwner) {
        throw new ApiError(404, "Store owner not found");
    }

    res.status(200).json(
        new ApiResponse(200, storeOwner, "Store owner profile retrieved successfully")
    );
});

export const updateStoreOwnerProfile = asyncHandler(async (req, res) => {
    const user = (req as any).user;
    const { name, address } = req.body;

    if (!user || user.role !== UserRole.STORE_OWNER) {
        throw new ApiError(403, "Only store owners can update their profile");
    }

    const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
            ...(name && { name }),
            ...(address && { address })
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

    res.status(200).json(
        new ApiResponse(200, updatedUser, "Profile updated successfully")
    );
});

export const createOwnStore = asyncHandler(async (req, res) => {
    const user = (req as any).user;

    if (!user || user.role !== UserRole.STORE_OWNER) {
        throw new ApiError(403, "Only store owners can create their own store");
    }

    const existingStore = await prisma.store.findUnique({
        where: { ownerId: user.id },
        select: { id: true }
    });

    if (existingStore) {
        throw new ApiError(409, "You already have a store. Each store owner can only have one store.");
    }

    const { name, email, address } = req.body;

    if (!name || !email || !address) {
        throw new ApiError(400, "Store name, email, and address are required");
    }

    const emailExists = await prisma.store.findUnique({
        where: { email },
        select: { id: true }
    });

    if (emailExists) {
        throw new ApiError(409, "A store with this email already exists");
    }

    const store = await prisma.store.create({
        data: {
            name,
            email,
            address,
            ownerId: user.id
        },
        include: {
            owner: {
                select: { id: true, name: true, email: true }
            }
        }
    });

    res.status(201).json(
        new ApiResponse(201, store, "Store created successfully")
    );
});

export const updateOwnStore = asyncHandler(async (req, res) => {
    const user = (req as any).user;

    if (!user || user.role !== UserRole.STORE_OWNER) {
        throw new ApiError(403, "Only store owners can update their store");
    }

    const existingStore = await prisma.store.findUnique({
        where: { ownerId: user.id },
        select: { id: true, email: true }
    });

    if (!existingStore) {
        throw new ApiError(404, "You don't have a store to update");
    }

    const { name, email, address } = req.body;

    if (email && email !== existingStore.email) {
        const emailConflict = await prisma.store.findUnique({
            where: { email },
            select: { id: true }
        });

        if (emailConflict) {
            throw new ApiError(409, "A store with this email already exists");
        }
    }

    const updatedStore = await prisma.store.update({
        where: { id: existingStore.id },
        data: {
            ...(name && { name }),
            ...(email && { email }),
            ...(address && { address })
        },
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
