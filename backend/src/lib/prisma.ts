import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Ensure only one instance of PrismaClient is used (especially in dev mode)
export const prisma =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ['query', 'info', 'warn', 'error'], // Optional logging
    });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;