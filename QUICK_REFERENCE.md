# Quick Reference Guide

## Common Patterns and Usage

### ?? Configuration

```typescript
// Import validated environment config
import { env, buildAppUrl, isProduction } from '@/lib/config/env';

// Access environment variables (type-safe)
const apiUrl = env.CAL_API_BASE_URL;
const clientId = env.CAL_COM_CLIENT_ID;

// Build URLs
const callbackUrl = buildAppUrl('/api/callback');

// Environment checks
if (isProduction()) {
  // Production-specific logic
}
```

### ? Error Handling

```typescript
// Import error utilities
import { ErrorFactory, isAppError, serializeError } from '@/lib/errors';

// Create typed errors
throw ErrorFactory.authentication('Invalid token');
throw ErrorFactory.validation('Invalid input', validationDetails);
throw ErrorFactory.notFound('User not found', { userId });
throw ErrorFactory.externalAPI('API failed', 502, response);

// Check error types
if (isAppError(error)) {
  console.log(error.code, error.statusCode, error.details);
}

// Serialize for logging
const errorData = serializeError(error);
```

### ?? Logging

```typescript
// Import logger
import { createLogger } from '@/lib/logging/logger';

// Create logger with namespace
const logger = createLogger('module-name');

// Log with levels
logger.debug('Debug info', { data });
logger.info('Operation completed', { userId, count });
logger.warn('Warning occurred', { issue }, warningError);
logger.error('Error occurred', error, { context });

// Create child logger
const childLogger = logger.child('sub-module');
childLogger.info('Child message');
```

### ?? Authentication

```typescript
// Import auth middleware
import { requireAuth, requireAuthWithToken } from '@/lib/middleware/auth';

// In server actions
const authResult = await requireAuth(userId);
if (!authResult.success) {
  throw authResult.error;
}
const { accessToken, sessionId } = authResult.data;

// In API routes
const authResult = await requireAuthWithToken(request);
if (!authResult.success) {
  return errorResponse(authResult.error);
}
const { accessToken } = authResult.data;
```

### ? Validation

```typescript
// Import validation utilities
import { validate, validateOrThrow, validatePagination } from '@/lib/middleware/validation';
import { z } from 'zod';

// Define schema
const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
});

// Validate with Result pattern
const result = validate(userSchema, data, 'user input');
if (!result.success) {
  return errorResponse(result.error);
}
const user = result.data;

// Validate and throw on error
const user = validateOrThrow(userSchema, data, 'user input');

// Validate pagination
const paginationResult = validatePagination({ page: 1, pageSize: 20 });
```

### ?? API Responses

```typescript
// Import response utilities
import { successResponse, errorResponse } from '@/lib/api/response';

// Success response
return successResponse(data);

// Success with metadata
return successResponse(data, {
  meta: {
    pagination: {
      page: 1,
      pageSize: 20,
      total: 100,
      totalPages: 5,
    },
  },
});

// Error response (auto-detects status)
return errorResponse(error);

// Error with custom status
return errorResponse(error, { status: 404 });
```

### ?? Result Type

```typescript
// Import Result utilities
import { ok, err, isOk, isErr, tryCatch, unwrap } from '@/lib/utils/result';

// Create results
const success = ok(data);
const failure = err(new Error('Failed'));

// Check results
if (isOk(result)) {
  console.log(result.data);
} else {
  console.error(result.error);
}

// Wrap async operations
const result = await tryCatch(async () => {
  return await fetchData();
});

// Unwrap (throws if error)
const data = unwrap(result);

// Unwrap with default
const data = unwrapOr(result, defaultValue);
```

### ?? Service Layer

```typescript
// Import service
import { calBookingsService } from '@/lib/services/cal-bookings.service';

// Fetch bookings
const result = await calBookingsService.fetchBookings({
  accessToken,
  query: { status: ['upcoming'], take: 10 },
});

if (!result.success) {
  throw result.error;
}

const meetings = result.data;
```

### ??? Repository Pattern

```typescript
// Import repository
import { calBookingsRepository } from '@/lib/repositories/cal-bookings.repository';

// Fetch bookings
const result = await calBookingsRepository.fetchBookings({
  accessToken,
  query: { take: 10 },
});

if (!result.success) {
  throw result.error;
}

// Custom configuration
const testRepo = calBookingsRepository.withConfig({
  baseUrl: 'https://test-api.cal.com',
  timeout: 5000,
});
```

### ?? Constants

```typescript
// Import constants
import { HttpStatus, Pagination, Timeouts } from '@/lib/constants';

// Use HTTP status codes
if (response.status === HttpStatus.UNAUTHORIZED) {
  // Handle 401
}

// Pagination defaults
const page = Pagination.DEFAULT_PAGE;
const pageSize = Pagination.DEFAULT_PAGE_SIZE;

// Timeouts
const timeout = Timeouts.LONG; // 30 seconds
```

## Common Patterns by Context

### API Route Handler

```typescript
import { NextRequest } from 'next/server';
import { requireAuthWithToken } from '@/lib/middleware/auth';
import { validate } from '@/lib/middleware/validation';
import { successResponse, errorResponse } from '@/lib/api/response';
import { createLogger } from '@/lib/logging/logger';
import { mySchema } from './schema';

const logger = createLogger('api:my-route');

export async function POST(request: NextRequest) {
  try {
    logger.info('Received request');

    // Authenticate
    const authResult = await requireAuthWithToken(request);
    if (!authResult.success) {
      return errorResponse(authResult.error);
    }

    // Validate body
    const body = await request.json();
    const validationResult = validate(mySchema, body);
    if (!validationResult.success) {
      return errorResponse(validationResult.error);
    }

    // Business logic
    const result = await processData(validationResult.data);
    
    logger.info('Request processed successfully');
    return successResponse(result);
  } catch (error) {
    logger.error('Request failed', error);
    return errorResponse(error);
  }
}
```

### Server Action

```typescript
'use server';

import { requireAuth } from '@/lib/middleware/auth';
import { validateOrThrow } from '@/lib/middleware/validation';
import { createLogger } from '@/lib/logging/logger';
import { mySchema } from './schema';

const logger = createLogger('actions:my-action');

export async function myAction(input: unknown) {
  try {
    logger.info('Executing action');

    // Validate input
    const validated = validateOrThrow(mySchema, input, 'action input');

    // Authenticate
    const authResult = await requireAuth(validated.userId);
    if (!authResult.success) {
      throw authResult.error;
    }

    // Business logic
    const result = await processData({
      ...validated,
      accessToken: authResult.data.accessToken,
    });

    logger.info('Action completed');
    return result;
  } catch (error) {
    logger.error('Action failed', error);
    throw error;
  }
}
```

### Service Method

```typescript
import { createLogger } from '@/lib/logging/logger';
import { ErrorFactory } from '@/lib/errors';
import { ok, err, tryCatch } from '@/lib/utils/result';
import type { Result } from '@/lib/utils/result';

const logger = createLogger('service:my-service');

export class MyService {
  async fetchData(id: string): Promise<Result<Data, Error>> {
    logger.info('Fetching data', { id });

    const result = await tryCatch(async () => {
      const data = await repository.fetch(id);
      return transformData(data);
    });

    if (!result.success) {
      logger.error('Failed to fetch data', result.error, { id });
      return err(ErrorFactory.externalAPI('Fetch failed', 502, result.error));
    }

    logger.info('Data fetched successfully', { id });
    return ok(result.data);
  }
}
```

## Cheat Sheet

| Task | Import | Usage |
|------|--------|-------|
| Get environment variable | `import { env } from '@/lib/config/env'` | `env.CAL_API_BASE_URL` |
| Create error | `import { ErrorFactory } from '@/lib/errors'` | `ErrorFactory.validation('msg')` |
| Log message | `import { createLogger } from '@/lib/logging/logger'` | `logger.info('msg')` |
| Authenticate (API) | `import { requireAuthWithToken } from '@/lib/middleware/auth'` | `await requireAuthWithToken(req)` |
| Authenticate (action) | `import { requireAuth } from '@/lib/middleware/auth'` | `await requireAuth(userId)` |
| Validate data | `import { validate } from '@/lib/middleware/validation'` | `validate(schema, data)` |
| Success response | `import { successResponse } from '@/lib/api/response'` | `successResponse(data)` |
| Error response | `import { errorResponse } from '@/lib/api/response'` | `errorResponse(error)` |
| Result type | `import { ok, err } from '@/lib/utils/result'` | `ok(data)` or `err(error)` |
| Service | `import { calBookingsService } from '@/lib/services/cal-bookings.service'` | `await service.fetchBookings()` |

## VS Code Snippets

Add these to your snippets for faster development:

```json
{
  "Import Logger": {
    "prefix": "imp-logger",
    "body": [
      "import { createLogger } from '@/lib/logging/logger';",
      "const logger = createLogger('${1:module-name}');"
    ]
  },
  "Import Errors": {
    "prefix": "imp-errors",
    "body": "import { ErrorFactory } from '@/lib/errors';"
  },
  "Import Auth": {
    "prefix": "imp-auth",
    "body": "import { requireAuth } from '@/lib/middleware/auth';"
  },
  "Import Response": {
    "prefix": "imp-response",
    "body": "import { successResponse, errorResponse } from '@/lib/api/response';"
  },
  "API Route Template": {
    "prefix": "api-route",
    "body": [
      "import { NextRequest } from 'next/server';",
      "import { requireAuthWithToken } from '@/lib/middleware/auth';",
      "import { successResponse, errorResponse } from '@/lib/api/response';",
      "import { createLogger } from '@/lib/logging/logger';",
      "",
      "const logger = createLogger('api:${1:route-name}');",
      "",
      "export async function ${2:GET}(request: NextRequest) {",
      "  try {",
      "    const authResult = await requireAuthWithToken(request);",
      "    if (!authResult.success) {",
      "      return errorResponse(authResult.error);",
      "    }",
      "",
      "    $0",
      "",
      "    return successResponse(data);",
      "  } catch (error) {",
      "    logger.error('Request failed', error);",
      "    return errorResponse(error);",
      "  }",
      "}"
    ]
  }
}
```

## Common Mistakes to Avoid

? **Don't use console.log**
```typescript
console.log('User logged in');
```

? **Use structured logging**
```typescript
logger.info('User logged in', { userId });
```

---

? **Don't throw generic errors**
```typescript
throw new Error('Failed');
```

? **Use typed errors**
```typescript
throw ErrorFactory.validation('Validation failed', details);
```

---

? **Don't access env directly**
```typescript
const apiUrl = process.env.CAL_API_BASE_URL;
```

? **Use validated config**
```typescript
const apiUrl = env.CAL_API_BASE_URL;
```

---

? **Don't return inconsistent responses**
```typescript
return NextResponse.json({ data });
```

? **Use standardized responses**
```typescript
return successResponse(data);
```

## Resources

- ?? **Detailed Guide**: See `/REFACTORING.md`
- ?? **Library Docs**: See `/lib/README.md`
- ?? **Summary**: See `/REFACTORING_SUMMARY.md`
- ?? **Code Examples**: Check updated route and action files
