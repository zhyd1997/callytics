# AGENTS

## Project Snapshot
- Callytics is a lightweight analytics dashboard for Cal.com users.
- Get instant insights into meetings, event types, and booking trends without a custom backend.
- Built with Next.js 16, Tailwind CSS v4, and Prisma.
- Cal.com OAuth 2.0 flow authenticates users via Next.js async cookies and exchanges tokens at `https://api.cal.com/v2/oauth/token`.
- Landing and dashboard surfaces currently ship with a Cal.com-inspired theme driven by shared tokens and animations in `app/globals.css`.

## Code Map
- `app/layout.tsx`: root layout, font loading, metadata, and analytics wiring
- `.agent/cal-com-openapi-spec.yaml`: Cal.com API v2 OpenAPI excerpt kept in sync with the official docs
- `.agent/coding-style.md`: shared coding conventions for components, styling, async flows, and quality gates
- `.agent/react-component-template.md`: starter client component snippet for quick copy/paste usage
- `modules/landing/Hero.tsx`: Cal.com-flavored marketing hero with OAuth CTA and motion accents
- `modules/dashboard/App.tsx`: client dashboard shell with Cal.com gradients and analytics modules
- `app/page.tsx`: primary UI; copy lives in the `DESCRIPTION` constant rendered twice to test wrapping
- `app/dashboard/page.tsx`: server component entry point that renders the dashboard `App`
- `app/dashboard/loading.tsx`: route-level loading fallback for the dashboard
- `app/dashboard/error.tsx`: client-side error boundary for the dashboard route
- `app/api/cal/bookings/route.ts`: proxy to Cal.com bookings endpoint enforcing DTO validation and auth pre-checks
- `app/globals.css`: global styles, Tailwind resets, and custom tokens
- `public/`: static assets (favicon, etc.) served as-is by Next.js
- `eslint.config.mjs`: workspace lint rules; lint runs with `pnpm lint`
- `app/api/cal/oauth/callback/route.ts`: Cal.com OAuth 2.0 redirect handler exchanging auth codes for tokens ([docs](https://cal.com/docs/api-reference/v2/oauth-clients/))
- `lib/auth/refresh-token.ts`: Auto-refresh utilities for Cal.com OAuth tokens; `getValidAccessToken(userId)` returns valid tokens, refreshing if expired
- `constants/oauth.ts`: Cal.com OAuth endpoints including `CAL_REFRESH_TOKEN_URL`
- `lib/schemas/calBookings.ts`: Zod schemas for Cal.com bookings payloads plus server-action input validation
- `lib/dto/calBookings.ts`: Normalization helpers and higher-level getters (summary, top bookings) built atop the DAL
- `lib/dal/calBookings.ts`: Low-level fetchers returning raw Cal.com API responses with typed error handling
- `app/(marketing)/waitlist/actions.ts`: server action for waitlist joins used by landing UI
- `app/(dashboard)/bookings/actions.ts`: server action wrapper around Cal bookings DAL for dashboard flows; uses auto-refresh tokens

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
- Keep theme tweaks inside `app/globals.css` so the landing hero and dashboard stay visually aligned; extend the existing palette/animations when introducing new seasonal flourishes.
- Reference `.agent/coding-style.md` for deeper guidance and drop reusable snippets like client component templates in `.agent/` when they would help future updates

## Deployment Notes
- Intended hosting target is Vercel; other platforms require configuring environment variables and analytics integrations manually
- Ensure `@vercel/analytics` is configured or swapped for an alternative before production rollout

## Open Questions
- Production analytics strategy beyond the default Vercel snippet
- Additional routes, data sources, or APIs needed to move beyond the placeholder copy

## Integration Notes
- Replace mock meeting data by invoking `fetchCalBookingsAction` in server components or delegating via `/api/cal/bookings` for client-side usage.
- Map `NormalizedCalBookingsResponse.items` into `Meeting` domain objects to keep dashboard modules typed until Cal data replaces mocks.
- Thread authenticated Cal.com access tokens through cookies or secure storage so both the server action and API route can read them without exposing secrets client-side.
- Call `fetchCalBookingSummaryByStatus` when you only need aggregate counts per status; it fetches a single booking slice and returns `{ status, totalItems }`.
- Use `fetchTopUpdatedBookings` to retrieve the three most recently updated bookings with `{ data, error, totalItems }`, where `totalItems` honors the API's pagination counts.

## Token Refresh
- Access tokens are automatically refreshed when expired (or within 5 minutes of expiry)
- Server actions use `getValidAccessToken(userId)` from `lib/auth/refresh-token.ts` which handles refresh transparently
- Refresh tokens are stored in the `Account` table via Better Auth's genericOAuth plugin
- The refresh flow calls Cal.com's `POST https://app.cal.com/api/auth/oauth/refreshToken` endpoint
- If a refresh token expires or fails, users must re-authenticate via OAuth
- For new integrations requiring Cal.com API access, always use `getValidAccessToken(userId)` instead of fetching tokens directly

Keep this file current so future agents can onboard quickly.

<!-- NEXT-AGENTS-MD-START -->[Next.js Docs Index]|root: ./.next-docs|STOP. What you remember about Next.js is WRONG for this project. Always search docs and read before any task.|If docs missing, run this command first: npx @next/codemod agents-md --output AGENTS.md|01-app:{04-glossary.mdx}|01-app/01-getting-started:{01-installation.mdx,02-project-structure.mdx,03-layouts-and-pages.mdx,04-linking-and-navigating.mdx,05-server-and-client-components.mdx,06-fetching-data.mdx,07-mutating-data.mdx,08-caching.mdx,09-revalidating.mdx,10-error-handling.mdx,11-css.mdx,12-images.mdx,13-fonts.mdx,14-metadata-and-og-images.mdx,15-route-handlers.mdx,16-proxy.mdx,17-deploying.mdx,18-upgrading.mdx}|01-app/02-guides:{ai-agents.mdx,analytics.mdx,authentication.mdx,backend-for-frontend.mdx,caching-without-cache-components.mdx,ci-build-caching.mdx,content-security-policy.mdx,css-in-js.mdx,custom-server.mdx,data-security.mdx,debugging.mdx,draft-mode.mdx,environment-variables.mdx,forms.mdx,incremental-static-regeneration.mdx,instant-navigation.mdx,instrumentation.mdx,internationalization.mdx,json-ld.mdx,lazy-loading.mdx,local-development.mdx,mcp.mdx,mdx.mdx,memory-usage.mdx,migrating-to-cache-components.mdx,multi-tenant.mdx,multi-zones.mdx,open-telemetry.mdx,package-bundling.mdx,prefetching.mdx,preserving-ui-state.mdx,production-checklist.mdx,progressive-web-apps.mdx,public-static-pages.mdx,redirecting.mdx,sass.mdx,scripts.mdx,self-hosting.mdx,single-page-applications.mdx,static-exports.mdx,streaming.mdx,tailwind-v3-css.mdx,third-party-libraries.mdx,videos.mdx}|01-app/02-guides/migrating:{app-router-migration.mdx,from-create-react-app.mdx,from-vite.mdx}|01-app/02-guides/testing:{cypress.mdx,jest.mdx,playwright.mdx,vitest.mdx}|01-app/02-guides/upgrading:{codemods.mdx,version-14.mdx,version-15.mdx,version-16.mdx}|01-app/03-api-reference:{07-edge.mdx,08-turbopack.mdx}|01-app/03-api-reference/01-directives:{use-cache-private.mdx,use-cache-remote.mdx,use-cache.mdx,use-client.mdx,use-server.mdx}|01-app/03-api-reference/02-components:{font.mdx,form.mdx,image.mdx,link.mdx,script.mdx}|01-app/03-api-reference/03-file-conventions/01-metadata:{app-icons.mdx,manifest.mdx,opengraph-image.mdx,robots.mdx,sitemap.mdx}|01-app/03-api-reference/03-file-conventions/02-route-segment-config:{dynamicParams.mdx,instant.mdx,maxDuration.mdx,preferredRegion.mdx,runtime.mdx}|01-app/03-api-reference/03-file-conventions:{default.mdx,dynamic-routes.mdx,error.mdx,forbidden.mdx,instrumentation-client.mdx,instrumentation.mdx,intercepting-routes.mdx,layout.mdx,loading.mdx,mdx-components.mdx,not-found.mdx,page.mdx,parallel-routes.mdx,proxy.mdx,public-folder.mdx,route-groups.mdx,route.mdx,src-folder.mdx,template.mdx,unauthorized.mdx}|01-app/03-api-reference/04-functions:{after.mdx,cacheLife.mdx,cacheTag.mdx,catchError.mdx,connection.mdx,cookies.mdx,draft-mode.mdx,fetch.mdx,forbidden.mdx,generate-image-metadata.mdx,generate-metadata.mdx,generate-sitemaps.mdx,generate-static-params.mdx,generate-viewport.mdx,headers.mdx,image-response.mdx,next-request.mdx,next-response.mdx,not-found.mdx,permanentRedirect.mdx,redirect.mdx,refresh.mdx,revalidatePath.mdx,revalidateTag.mdx,unauthorized.mdx,unstable_cache.mdx,unstable_noStore.mdx,unstable_rethrow.mdx,updateTag.mdx,use-link-status.mdx,use-params.mdx,use-pathname.mdx,use-report-web-vitals.mdx,use-router.mdx,use-search-params.mdx,use-selected-layout-segment.mdx,use-selected-layout-segments.mdx,userAgent.mdx}|01-app/03-api-reference/05-config/01-next-config-js:{adapterPath.mdx,allowedDevOrigins.mdx,appDir.mdx,assetPrefix.mdx,authInterrupts.mdx,basePath.mdx,cacheComponents.mdx,cacheHandlers.mdx,cacheLife.mdx,compress.mdx,crossOrigin.mdx,cssChunking.mdx,deploymentId.mdx,devIndicators.mdx,distDir.mdx,env.mdx,expireTime.mdx,exportPathMap.mdx,generateBuildId.mdx,generateEtags.mdx,headers.mdx,htmlLimitedBots.mdx,httpAgentOptions.mdx,images.mdx,incrementalCacheHandlerPath.mdx,inlineCss.mdx,logging.mdx,mdxRs.mdx,onDemandEntries.mdx,optimizePackageImports.mdx,output.mdx,pageExtensions.mdx,poweredByHeader.mdx,productionBrowserSourceMaps.mdx,proxyClientMaxBodySize.mdx,reactCompiler.mdx,reactMaxHeadersLength.mdx,reactStrictMode.mdx,redirects.mdx,rewrites.mdx,sassOptions.mdx,serverActions.mdx,serverComponentsHmrCache.mdx,serverExternalPackages.mdx,staleTimes.mdx,staticGeneration.mdx,taint.mdx,trailingSlash.mdx,transpilePackages.mdx,turbopack.mdx,turbopackFileSystemCache.mdx,turbopackIgnoreIssue.mdx,typedRoutes.mdx,typescript.mdx,urlImports.mdx,useLightningcss.mdx,viewTransition.mdx,webVitalsAttribution.mdx,webpack.mdx}|01-app/03-api-reference/05-config:{02-typescript.mdx,03-eslint.mdx}|01-app/03-api-reference/06-cli:{create-next-app.mdx,next.mdx}|02-pages/01-getting-started:{01-installation.mdx,02-project-structure.mdx,04-images.mdx,05-fonts.mdx,06-css.mdx,11-deploying.mdx}|02-pages/02-guides:{analytics.mdx,authentication.mdx,babel.mdx,ci-build-caching.mdx,content-security-policy.mdx,css-in-js.mdx,custom-server.mdx,debugging.mdx,draft-mode.mdx,environment-variables.mdx,forms.mdx,incremental-static-regeneration.mdx,instrumentation.mdx,internationalization.mdx,lazy-loading.mdx,mdx.mdx,multi-zones.mdx,open-telemetry.mdx,package-bundling.mdx,post-css.mdx,preview-mode.mdx,production-checklist.mdx,redirecting.mdx,sass.mdx,scripts.mdx,self-hosting.mdx,static-exports.mdx,tailwind-v3-css.mdx,third-party-libraries.mdx}|02-pages/02-guides/migrating:{app-router-migration.mdx,from-create-react-app.mdx,from-vite.mdx}|02-pages/02-guides/testing:{cypress.mdx,jest.mdx,playwright.mdx,vitest.mdx}|02-pages/02-guides/upgrading:{codemods.mdx,version-10.mdx,version-11.mdx,version-12.mdx,version-13.mdx,version-14.mdx,version-9.mdx}|02-pages/03-building-your-application/01-routing:{01-pages-and-layouts.mdx,02-dynamic-routes.mdx,03-linking-and-navigating.mdx,05-custom-app.mdx,06-custom-document.mdx,07-api-routes.mdx,08-custom-error.mdx}|02-pages/03-building-your-application/02-rendering:{01-server-side-rendering.mdx,02-static-site-generation.mdx,04-automatic-static-optimization.mdx,05-client-side-rendering.mdx}|02-pages/03-building-your-application/03-data-fetching:{01-get-static-props.mdx,02-get-static-paths.mdx,03-forms-and-mutations.mdx,03-get-server-side-props.mdx,05-client-side.mdx}|02-pages/03-building-your-application/06-configuring:{12-error-handling.mdx}|02-pages/04-api-reference:{06-edge.mdx,08-turbopack.mdx}|02-pages/04-api-reference/01-components:{font.mdx,form.mdx,head.mdx,image-legacy.mdx,image.mdx,link.mdx,script.mdx}|02-pages/04-api-reference/02-file-conventions:{instrumentation.mdx,proxy.mdx,public-folder.mdx,src-folder.mdx}|02-pages/04-api-reference/03-functions:{get-initial-props.mdx,get-server-side-props.mdx,get-static-paths.mdx,get-static-props.mdx,next-request.mdx,next-response.mdx,use-params.mdx,use-report-web-vitals.mdx,use-router.mdx,use-search-params.mdx,userAgent.mdx}|02-pages/04-api-reference/04-config/01-next-config-js:{adapterPath.mdx,allowedDevOrigins.mdx,assetPrefix.mdx,basePath.mdx,bundlePagesRouterDependencies.mdx,compress.mdx,crossOrigin.mdx,deploymentId.mdx,devIndicators.mdx,distDir.mdx,env.mdx,exportPathMap.mdx,generateBuildId.mdx,generateEtags.mdx,headers.mdx,httpAgentOptions.mdx,images.mdx,logging.mdx,onDemandEntries.mdx,optimizePackageImports.mdx,output.mdx,pageExtensions.mdx,poweredByHeader.mdx,productionBrowserSourceMaps.mdx,proxyClientMaxBodySize.mdx,reactStrictMode.mdx,redirects.mdx,rewrites.mdx,serverExternalPackages.mdx,trailingSlash.mdx,transpilePackages.mdx,turbopack.mdx,typescript.mdx,urlImports.mdx,useLightningcss.mdx,webVitalsAttribution.mdx,webpack.mdx}|02-pages/04-api-reference/04-config:{01-typescript.mdx,02-eslint.mdx}|02-pages/04-api-reference/05-cli:{create-next-app.mdx,next.mdx}|03-architecture:{accessibility.mdx,fast-refresh.mdx,nextjs-compiler.mdx,supported-browsers.mdx}|04-community:{01-contribution-guide.mdx,02-rspack.mdx}<!-- NEXT-AGENTS-MD-END -->
