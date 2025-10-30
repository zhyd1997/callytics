import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from "@/app/generated/prisma/client";
import { genericOAuth } from "better-auth/plugins"
import { nextCookies } from "better-auth/next-js";

const prisma = new PrismaClient();
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    genericOAuth({ 
      config: [ 
        { 
          providerId: "cal", 
          clientId: process.env.CAL_COM_CLIENT_ID!, 
          clientSecret: process.env.CAL_COM_CLIENT_SECRET!, 
          // discoveryUrl: "https://auth.example.com/.well-known/openid-configuration", 
          // ... other config options
        }, 
        // Add more providers as needed
      ] 
    }),
    nextCookies()] // make sure this is the last plugin in the array
});
