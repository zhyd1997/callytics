![Callytics Logo](./public/logo/callytics-logo-wordmark-dark.png#gh-dark-mode-only)
![Callytics Logo](./public/logo/callytics-logo-wordmark-light.png#gh-light-mode-only)

# Callytics ✨

Lightweight analytics for Cal.com workspaces. Callytics gives teams instant visibility into meetings, event types, and booking trends without maintaining a bespoke reporting stack. 📊

## Features 💡
- OAuth 2.0 flow for Cal.com accounts with stateful callback handling 🔐
- Postgres-backed waitlist capture powered by Prisma Accelerate 📨
- Interactive, Stripe-inspired landing hero with flowing gradient ribbons and OAuth CTA 🌈
- Analytics dashboard refreshed with the new payments-grade palette, motion charts, and dark-mode friendly glows 📈
- Turbopack-enabled Next.js 16 app router with Tailwind CSS v4 styling ⚡️

## Tech Stack 🛠️
- Next.js 16 (App Router, React 19, Turbopack)
- Tailwind CSS v4 with custom design tokens
- Prisma ORM + Accelerate extension targeting PostgreSQL
- Vercel Analytics snippet for production telemetry 📈

## Prerequisites ✅
- Node.js 18.18 or newer (Next.js 16 requirement)
- pnpm 8.x or newer
- PostgreSQL database for the waitlist table 🐘
- Cal.com OAuth client credentials for the token exchange flow 🔑

## Quick Start 🚀
1. Install dependencies: `pnpm install`
2. Duplicate `.env.example` (or create `.env.local`) and set the required variables listed below
3. Run database migrations: `pnpm prisma migrate dev`
4. Start the dev server: `pnpm dev` and visit [http://localhost:3000](http://localhost:3000) 🎯

The `preinstall` script runs `prisma generate` so the generated client is always in sync. Turbopack handles hot reloading during development.

### Environment Variables 🌱
| Variable | Required | Description | Default |
| --- | --- | --- | --- |
| `DATABASE_URL` | Yes | PostgreSQL connection string used by Prisma | – |
| `CAL_OAUTH_CLIENT_ID` | Yes | OAuth client ID from your Cal.com developer app | – |
| `CAL_OAUTH_CLIENT_SECRET` | Yes | OAuth client secret from Cal.com | – |
| `CAL_OAUTH_REDIRECT_URI` | Optional | Explicit redirect URI to override the auto-detected callback | `http://localhost:3000/api/cal/oauth/callback` |
| `CAL_OAUTH_TOKEN_ENDPOINT` | Optional | Alternate Cal.com token endpoint (sandbox/self-hosted) | `https://api.cal.com/v2/oauth/token` |

Optional variables only need to be set when you diverge from the default local flow.

### Cal.com OAuth Setup 🤝
- Register a **Confidential OAuth App** inside the Cal.com developer portal.
- Configure the redirect URI to `http://localhost:3000/api/cal/oauth/callback` (or your deployed domain).
- Copy the client ID and secret into your `.env.local`.
- During the auth redirect the callback verifies the `state` cookie and exchanges the code for access/refresh tokens at `CAL_OAUTH_TOKEN_ENDPOINT`. Tokens are returned to the caller and should be persisted securely (e.g., server-side store).

### Database & Prisma 🗄️
- Prisma schema lives in `prisma/schema.prisma` and generates the client under `app/generated/prisma`.
- Migrations are stored in `prisma/migrations`. Apply them with `pnpm prisma migrate dev` for local development or `pnpm prisma migrate deploy` in CI/CD.
- The waitlist module writes to the `waitlist_entries` table via `lib/dal/waitlist.ts`.

## Available Scripts 🧰
- `pnpm dev` – start the Next.js dev server with Turbopack
- `pnpm build` – run Prisma migrations (via `prebuild`) then build for production
- `pnpm start` – serve the production build
- `pnpm lint` – execute the repository ESLint configuration
- `pnpm prisma <command>` – forward arbitrary Prisma CLI commands (generate, migrate, studio, etc.)

## Project Structure 🧭
- `app/` – Next.js route handlers, layouts, API routes, and generated Prisma client
- `modules/` – UI modules
- `components/` – shared UI primitives (buttons, cards, theming controls)
- `lib/` – Prisma client factory, waitlist data access layer, and schemas
- `prisma/` – schema and migrations for the Postgres database
- `.agent/` – onboarding docs, Cal.com OpenAPI excerpt, and shared conventions

## Deployment ☁️
- Optimized for Vercel; environment variables must be defined in the project settings
- Ensure your production database and Cal.com OAuth redirect URIs match the deployed domain
- Replace or configure `@vercel/analytics` if you use a different analytics provider

## Useful Links 🔗
- [Cal.com OAuth 2.0 Docs](https://cal.com/docs/api-reference/v2/oauth-clients/)
- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Prisma Documentation](https://www.prisma.io/docs)
- [AGENTS.md](./AGENTS.md) – living brief for contributor onboarding
