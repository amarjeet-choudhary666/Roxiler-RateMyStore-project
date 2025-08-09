import jwt from 'jsonwebtoken';
import { ApiError } from './apiError';

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET= process.env.REFRESH_TOKEN_SECRET;

export const generateAccessToken = (userId: string) => {
  return jwt.sign({userId}, ACCESS_TOKEN_SECRET!, {expiresIn: "40m"})
}

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({userId}, REFRESH_TOKEN_SECRET!, {expiresIn: "7d"})
}


export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_TOKEN_SECRET!)
}

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET!)
}