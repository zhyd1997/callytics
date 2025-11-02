// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from '@/app/generated/prisma';
import { withAccelerate } from '@prisma/extension-accelerate';
import { envConfig } from '@/lib/env';

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

const prismaClient = globalForPrisma.prisma ?? new PrismaClient().$extends(withAccelerate());

// Prevent multiple instances of Prisma Client in development
if (!envConfig.isProduction) {
  globalForPrisma.prisma = prismaClient;
}

export default prismaClient;
