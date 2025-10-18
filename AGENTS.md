# AGENTS

## Project Snapshot
- Callytics is a lightweight analytics dashboard for Cal.com users.
- Get instant insights into meetings, event types, and booking trends without a custom backend.
- Built with Next.js 16, Tailwind CSS v4, and Prisma.
- Cal.com OAuth 2.0 flow authenticates users via Next.js async cookies and exchanges tokens at `https://api.cal.com/v2/oauth/token`.

## Code Map
- `app/layout.tsx`: root layout, font loading, metadata, and analytics wiring
- `.agent/cal-com-openapi-spec.yaml`: Cal.com API v2 OpenAPI excerpt kept in sync with the official docs
- `.agent/coding-style.md`: shared coding conventions for components, styling, async flows, and quality gates
- `.agent/react-component-template.md`: starter client component snippet for quick copy/paste usage
- `app/page.tsx`: primary UI; copy lives in the `DESCRIPTION` constant rendered twice to test wrapping
- `app/globals.css`: global styles, Tailwind resets, and custom tokens
- `public/`: static assets (favicon, etc.) served as-is by Next.js
- `eslint.config.mjs`: workspace lint rules; lint runs with `pnpm lint`
- `app/api/cal/oauth/callback/route.ts`: Cal.com OAuth 2.0 redirect handler exchanging auth codes for tokens ([docs](https://cal.com/docs/api-reference/v2/oauth-clients/))

## Local Development
- Install deps with `pnpm install` (Node 18.18+ recommended for Next 16)
- Start the dev server via `pnpm dev` (Turbopack enabled by default); visit http://localhost:3000
- Build for production with `pnpm build` and run the output via `pnpm start`

## Testing & Quality
- No automated tests are defined yet; plan to introduce unit/UI coverage (e.g. Vitest, Playwright)
- Run `pnpm lint` before committing; ESLint is the current quality gate

## Conventions
- Favor server components unless client interactivity is required; mark client modules with the `"use client"` directive
- Co-locate component styles or variants within the `app/` route segment where they are consumed
- Keep copy constants and configuration in module scope to leverage static optimization
- Reference `.agent/coding-style.md` for deeper guidance and drop reusable snippets like client component templates in `.agent/` when they would help future updates

## Deployment Notes
- Intended hosting target is Vercel; other platforms require configuring environment variables and analytics integrations manually
- Ensure `@vercel/analytics` is configured or swapped for an alternative before production rollout

## Open Questions
- Production analytics strategy beyond the default Vercel snippet
- Additional routes, data sources, or APIs needed to move beyond the placeholder copy

Keep this file current so future agents can onboard quickly.
