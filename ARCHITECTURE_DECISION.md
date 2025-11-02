# Architecture Decision: Server Actions vs API Routes

## Decision: Use Server Actions for Internal Dashboard Operations

### Current Implementation
- ? **Server Actions** (`app/(dashboard)/bookings/actions.ts`) - Used in server components
- ?? **API Route** (`app/api/cal/bookings/route.ts`) - Exists but not actively used

### Recommendation: Standardize on Server Actions

#### Use Server Actions For:
1. **Internal dashboard operations** (current use case)
2. **Form submissions** (e.g., waitlist form)
3. **Server-to-server data fetching** (like in `app/dashboard/page.tsx`)
4. **Mutations that need session/auth** (automatically handled)
5. **Type-safe operations** within the Next.js app

#### Keep API Routes For:
1. **External integrations** (webhooks, third-party APIs)
2. **Public endpoints** that don't require Next.js session
3. **Multiple HTTP methods** (PUT, DELETE, PATCH) in a single route
4. **Client-side fetch** from external applications
5. **When you need precise HTTP status codes/headers**

### Migration Path

**Option 1: Remove API Route (Recommended)**
- Delete `app/api/cal/bookings/route.ts` if not needed
- Use server actions exclusively for internal operations

**Option 2: Keep Both (If Needed)**
- Use Server Actions for internal Next.js app usage
- Keep API route for external access/webhooks
- Document which to use when

### Benefits of Server Actions

1. **Type Safety**: Full TypeScript support end-to-end
2. **Simpler Code**: No manual request/response handling
3. **Automatic Auth**: Session handling built-in
4. **Better Performance**: No HTTP overhead for server-to-server
5. **Error Handling**: Integrated with React error boundaries
6. **Progressive Enhancement**: Works without JavaScript

### Example Usage Pattern

```typescript
// ? Server Component (Server Action)
// app/dashboard/page.tsx
const data = await fetchCalBookingsAction({ userId, query });

// ? Client Component (via props from server)
// modules/dashboard/App.tsx
<DashboardApp initialMeetings={data} />

// ? Client Component (Direct Server Action call)
// For mutations or real-time updates
'use client';
import { fetchCalBookingsAction } from '@/app/(dashboard)/bookings/actions';
const [data, setData] = useState();
await fetchCalBookingsAction({ userId, query });
```

### When API Routes Make Sense

```typescript
// API Route Example: External webhook
// app/api/webhooks/cal-com/route.ts
export async function POST(request: Request) {
  // Handle external webhook from Cal.com
  // Verify signature, process event
}
```

### Conclusion

For the Callytics dashboard, **Server Actions are the better choice** because:
- You're building an internal dashboard (not a public API)
- You need seamless authentication/session handling
- You want type safety and better DX
- Most operations are server-to-server

Keep the API route only if you need external access or webhooks.
