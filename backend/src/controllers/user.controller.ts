import prisma from "../lib/prisma";
import { userLoginSchema, userSignupSchema } from "../models/user.model";
import { ApiError } from "../utils/apiError";
import { ApiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import bcrypt from "bcrypt";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";

export const registerUser = asyncHandler(async (req, res) => {
    const result = userSignupSchema.safeParse(req.body);

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
            role: "NORMAL_USER"
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
        new ApiResponse(201, {
            user,
        }, "User registered successfully")
    );
});

export const loginUser = asyncHandler(async (req, res) => {
    const result = userLoginSchema.safeParse(req.body);

    if (!result.success) {
        return res.status(200).json(
            {
                error: result.error.format()
            }
        )
    }

    const { email, password } = result.data;

    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid email or password");
    }

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

    const userResponse = {
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        role: user.role,
        createdAt: user.createdAt
    };

    res.status(200).json(
        new ApiResponse(200, {
            user: userResponse,
            accessToken,
            refreshToken
        }, "Login successful")
    );
});

export const getUserProfile = asyncHandler(async (req, res) => {
    const user = req.user;

    if (!user) {
        throw new ApiError(401, "User not authenticated");
    }

    res.status(200).json(
        new ApiResponse(200, { user }, "Profile retrieved successfully")
    );
});

export const updateUserProfile = asyncHandler(async (req, res) => {
    const user = req.user;
    const { name, address } = req.body;

    if (!user) {
        throw new ApiError(401, "User not authenticated");
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
        new ApiResponse(200, { user: updatedUser }, "Profile updated successfully")
    );
});
