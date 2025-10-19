# Callytics Coding Style

## Component conventions
- Default to server components; add "use client" only when interactivity is required.
- Keep copy constants and configuration in module scope to leverage static optimization.
- Co-locate component variants and supporting styles within their route segment.

## TypeScript and structure
- Prefer explicit types when inference is unclear; tighten types with `readonly` where possible.
- Favor small, composable modules; keep data-fetching on the server when feasible.
- Organize exports so server logic stays in `app/` and shared utilities live under `lib/` when introduced.
- If a TS type is only used as a type, use `import type ... from ...` instead of `import ... from ...`

## Styling
- Use Tailwind utility classes first; reserve custom CSS tokens for `app/globals.css`.
- Avoid inline styles unless values are truly dynamic; extract repeated patterns into Tailwind components.

## Async and data
- Use async/await with Next.js routing conventions; surface Supabase or API errors with meaningful messages.
- Cache external calls responsibly and document any long-lived caching strategies.

## Comments and documentation
- Add comments sparingly to capture intent or edge-case reasoning; keep them concise.
- Update `.agent/` docs when conventions evolve so future contributors stay aligned.

## Quality
- Run `pnpm lint` before committing; add targeted tests alongside new features when the test suite arrives.
- Document new scripts or workflows in the README to keep onboarding smooth.
