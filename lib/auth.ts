import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import { PrismaClient } from "@/app/generated/prisma/client";
import { genericOAuth } from "better-auth/plugins"
import { nextCookies } from "better-auth/next-js";
import { PROVIDER_ID } from "@/constants/oauth";

const prisma = new PrismaClient();

/**
 * @see https://www.better-auth.com/docs/concepts/oauth
 * @see https://cal.com/help/apps-and-integrations/oauth
 */
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  plugins: [
    genericOAuth({ 
      config: [
        { 
          providerId: PROVIDER_ID,
          clientId: process.env.CAL_COM_CLIENT_ID!,
          clientSecret: process.env.CAL_COM_CLIENT_SECRET!,
          authorizationUrl: "https://app.cal.com/auth/oauth2/authorize",
          tokenUrl: "https://app.cal.com/api/auth/oauth/token",
          redirectURI: "http://localhost:3000/api/cal/oauth/callback",
          getUserInfo: async (token) => {
            const res = await fetch("https://api.cal.com/v2/me", {
              headers: {
                Authorization: `Bearer ${token.accessToken}`,
              }
            })
            
            const { data: profile, status } = await res.json()
            console.log(profile)

            return {
              id: profile?.id,
              name: profile?.username,
              email: profile?.email,
              image: undefined,
              emailVerified: true,
            }
          },
          scopes: ["READ_BOOKING"],
          // , "EVENT_TYPE_READ", "BOOKING_READ", "SCHEDULE_READ", "APPS_READ", "PROFILE_READ"
          // discoveryUrl: "https://auth.example.com/.well-known/openid-configuration", 
          // ... other config options
        }, 
        // Add more providers as needed
      ] 
    }),
    nextCookies()] // make sure this is the last plugin in the array
});
