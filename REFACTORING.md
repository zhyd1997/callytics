# Refactoring Documentation

## Overview

This document describes the comprehensive refactoring performed on the Callytics codebase to implement best practices and improve system design. The refactoring focuses on maintainability, testability, type safety, and separation of concerns.

## What Was Refactored

### 1. **Configuration Management** (`lib/config/env.ts`)

**Before**: Environment variables scattered throughout codebase with inconsistent validation
**After**: Centralized, type-safe configuration with Zod validation

**Benefits**:
- All environment variables validated at startup
- Type-safe access to configuration values
- Clear error messages for missing/invalid configuration
- Utility functions for URL building and environment checks

**Usage**:
```typescript
import { env, buildAppUrl, isProduction } from '@/lib/config/env';

const apiUrl = env.CAL_API_BASE_URL;
const callbackUrl = buildAppUrl('/api/callback');
if (isProduction()) {
  // Production-specific logic
}
```

### 2. **Error Handling** (`lib/errors/index.ts`)

**Before**: Generic Error objects with inconsistent structure
**After**: Hierarchical error classes with standardized structure

**New Error Classes**:
- `AppError` - Base class for all application errors
- `AuthenticationError` - 401 errors
- `AuthorizationError` - 403 errors
- `ValidationError` - 400 errors
- `NotFoundError` - 404 errors
- `ExternalAPIError` - External API failures
- `ConfigurationError` - Configuration issues
- `DatabaseError` - Database failures
- `InternalError` - Generic internal errors

**Benefits**:
- Consistent error structure across the application
- Type-safe error handling
- Rich error context with details and timestamps
- Easy error serialization for logging and API responses
- `ErrorFactory` for convenient error creation

**Usage**:
```typescript
import { ErrorFactory, isAppError } from '@/lib/errors';

// Creating errors
throw ErrorFactory.authentication('Invalid token', { userId: 123 });
throw ErrorFactory.validation('Invalid input', validationErrors);

// Checking errors
if (isAppError(error)) {
  console.log(error.code, error.statusCode);
}
```

### 3. **Structured Logging** (`lib/logging/logger.ts`)

**Before**: `console.log` and `console.error` scattered throughout
**After**: Structured logging service with levels and context

**Features**:
- Log levels: DEBUG, INFO, WARN, ERROR
- Contextual information with each log
- Namespaced loggers for different modules
- Environment-aware formatting (human-readable in dev, JSON in production)
- Automatic error serialization

**Benefits**:
- Consistent logging format
- Easy to filter and search logs
- Production-ready JSON logging
- Child loggers for module-specific logging

**Usage**:
```typescript
import { createLogger } from '@/lib/logging/logger';

const logger = createLogger('module-name');

logger.info('User logged in', { userId: 123 });
logger.error('Failed to fetch data', error, { endpoint: '/api/data' });

// Child logger
const childLogger = logger.child('sub-module');
```

### 4. **API Response Standardization** (`lib/api/response.ts`)

**Before**: Inconsistent response formats across API routes
**After**: Standardized success and error response structures

**Features**:
- `ApiSuccessResponse` - Standard success response type
- `ApiErrorResponse` - Standard error response type
- Helper functions for creating responses
- Automatic error handling wrapper
- Pagination metadata utilities

**Benefits**:
- Consistent API contract
- Type-safe responses
- Centralized error handling
- Easy to document and test

**Usage**:
```typescript
import { successResponse, errorResponse, withErrorHandling } from '@/lib/api/response';

// Success response
return successResponse({ bookings: [...] }, {
  meta: { pagination: { page: 1, total: 100 } }
});

// Error response
return errorResponse(error);

// Wrap handler with error handling
export const GET = (req: NextRequest) => withErrorHandling(async () => {
  const data = await fetchData();
  return successResponse(data);
});
```

### 5. **Result Type Pattern** (`lib/utils/result.ts`)

**Before**: Try-catch blocks everywhere with inconsistent error handling
**After**: Functional Result type for explicit success/failure handling

**Features**:
- `Result<T, E>` type with `Success` and `Failure` variants
- Helper functions: `ok()`, `err()`, `isOk()`, `isErr()`
- Functional operations: `map()`, `mapErr()`, `andThen()`
- `tryCatch()` for wrapping async operations
- `collect()` for handling arrays of Results

**Benefits**:
- Explicit error handling
- Type-safe error propagation
- No unexpected exceptions
- Composable error handling patterns

**Usage**:
```typescript
import { ok, err, tryCatch, isOk } from '@/lib/utils/result';

// Create results
const result = ok(data);
const failure = err(new Error('Failed'));

// Async operations
const result = await tryCatch(async () => {
  return await fetchData();
});

if (isOk(result)) {
  console.log(result.data);
} else {
  console.error(result.error);
}
```

### 6. **Authentication Middleware** (`lib/middleware/auth.ts`)

**Before**: Authentication logic duplicated in routes and actions
**After**: Reusable authentication middleware functions

**Features**:
- `requireAuth()` - For server actions
- `requireAuthWithToken()` - For API routes with Bearer token
- `requireResourceAccess()` - For resource-level authorization
- Returns `Result` type for explicit error handling

**Benefits**:
- DRY authentication logic
- Consistent auth checks
- Type-safe auth results
- Easy to test in isolation

**Usage**:
```typescript
import { requireAuth, requireAuthWithToken } from '@/lib/middleware/auth';

// In server actions
const authResult = await requireAuth(userId);
if (!authResult.success) {
  throw authResult.error;
}

// In API routes
const authResult = await requireAuthWithToken(request);
if (!authResult.success) {
  return errorResponse(authResult.error);
}
```

### 7. **Validation Middleware** (`lib/middleware/validation.ts`)

**Before**: Zod validation repeated with inconsistent error handling
**After**: Reusable validation middleware with Result pattern

**Features**:
- `validate()` - Returns Result type
- `validateOrThrow()` - Throws on validation error
- `createValidator()` - Factory for schema-specific validators
- Built-in pagination validation
- Conversion utilities for pagination

**Benefits**:
- DRY validation logic
- Consistent validation error format
- Type-safe validation results
- Reusable validators

**Usage**:
```typescript
import { validate, validateOrThrow, validatePagination } from '@/lib/middleware/validation';

// With Result pattern
const result = validate(schema, data);
if (!result.success) {
  return errorResponse(result.error);
}

// Throw on error
const validated = validateOrThrow(schema, data, 'user input');

// Pagination
const paginationResult = validatePagination({ page: 1, pageSize: 20 });
```

### 8. **Service Layer** (`lib/services/cal-bookings.service.ts`)

**Before**: Business logic mixed with API routes and actions
**After**: Dedicated service layer for business logic

**Features**:
- `CalBookingsService` class with focused methods
- Result-based error handling
- Centralized business logic
- Singleton pattern for easy access

**Benefits**:
- Separation of concerns
- Easy to test business logic
- Reusable across routes and actions
- Single source of truth for operations

**Usage**:
```typescript
import { calBookingsService } from '@/lib/services/cal-bookings.service';

const result = await calBookingsService.fetchBookings({
  accessToken,
  query,
});

if (!result.success) {
  throw result.error;
}

const meetings = result.data;
```

### 9. **Repository Pattern** (`lib/repositories/cal-bookings.repository.ts`)

**Before**: Direct API calls mixed with business logic
**After**: Repository pattern for data access abstraction

**Features**:
- `CalBookingsRepository` class
- Configuration injection for testability
- Timeout handling
- Detailed logging
- Result-based error handling

**Benefits**:
- Abstraction of data access
- Easy to mock for testing
- Consistent API interaction
- Configurable for different environments

**Usage**:
```typescript
import { calBookingsRepository } from '@/lib/repositories/cal-bookings.repository';

const result = await calBookingsRepository.fetchBookings({
  accessToken,
  query,
});

// Custom configuration
const testRepo = calBookingsRepository.withConfig({
  baseUrl: 'https://test-api.cal.com',
  timeout: 5000,
});
```

### 10. **Constants Organization** (`lib/constants/index.ts`)

**Before**: Constants scattered across files
**After**: Centralized constants with enums and const objects

**New Constants**:
- `HttpStatus` - HTTP status code enum
- `ApiVersion` - API version enum
- `CacheControl` - Cache durations
- `Pagination` - Pagination defaults
- `Timeouts` - Request timeouts
- `DateFormats` - Date format strings
- `Regex` - Common regex patterns

**Benefits**:
- Single source of truth for constants
- Type-safe constant access
- Easy to maintain and update
- Self-documenting code

**Usage**:
```typescript
import { HttpStatus, Pagination, Timeouts } from '@/lib/constants';

if (response.status === HttpStatus.UNAUTHORIZED) {
  // Handle 401
}

const defaultPage = Pagination.DEFAULT_PAGE;
const timeout = Timeouts.LONG;
```

### 11. **Refactored Existing Code**

**Updated Files**:
- `lib/dal/calBookings.ts` - Added logging and improved error handling
- `app/(dashboard)/bookings/actions.ts` - Uses new middleware and logging
- `app/api/cal/bookings/route.ts` - Uses standardized responses and middleware
- `lib/auth.ts` - Uses new config system and error handling

## Architecture Improvements

### Layered Architecture

```
???????????????????????????????????????
?  Presentation Layer                 ?
?  (API Routes, Server Actions, UI)   ?
???????????????????????????????????????
?  Middleware Layer                   ?
?  (Auth, Validation, Error Handling) ?
???????????????????????????????????????
?  Service Layer                      ?
?  (Business Logic)                   ?
???????????????????????????????????????
?  Data Access Layer                  ?
?  (Repositories, DTO, DAL)           ?
???????????????????????????????????????
?  Infrastructure Layer               ?
?  (Config, Logging, Errors, Utils)   ?
???????????????????????????????????????
```

### Dependency Flow

- Upper layers depend on lower layers
- Infrastructure layer has no dependencies
- Easy to test each layer in isolation
- Clear separation of concerns

## Testing Strategy

The refactored architecture enables comprehensive testing:

1. **Unit Tests**:
   - Test utilities, validators, error classes in isolation
   - Test repositories with mocked fetch
   - Test services with mocked repositories

2. **Integration Tests**:
   - Test API routes with real services
   - Test server actions with auth middleware
   - Test full data flow

3. **E2E Tests**:
   - Test complete user flows
   - Test with actual Cal.com API (staging)

## Migration Guide

### For Existing Code

1. **Replace console.log with logger**:
   ```typescript
   // Before
   console.log('Fetching data');
   
   // After
   import { createLogger } from '@/lib/logging/logger';
   const logger = createLogger('module');
   logger.info('Fetching data');
   ```

2. **Use Error classes instead of Error**:
   ```typescript
   // Before
   throw new Error('Not found');
   
   // After
   throw ErrorFactory.notFound('Resource not found');
   ```

3. **Standardize API responses**:
   ```typescript
   // Before
   return NextResponse.json({ data });
   
   // After
   return successResponse(data);
   ```

4. **Use Result pattern for error handling**:
   ```typescript
   // Before
   try {
     const data = await fetchData();
     return data;
   } catch (error) {
     console.error(error);
     throw error;
   }
   
   // After
   const result = await tryCatch(() => fetchData());
   if (!result.success) {
     logger.error('Fetch failed', result.error);
     return err(result.error);
   }
   return ok(result.data);
   ```

## Benefits Summary

1. **Maintainability**: Clear structure and separation of concerns
2. **Testability**: Dependency injection and isolated layers
3. **Type Safety**: Stronger typing throughout the codebase
4. **Error Handling**: Consistent and predictable error flows
5. **Logging**: Structured logs for debugging and monitoring
6. **Developer Experience**: Better IDE support and clearer code
7. **Production Ready**: Proper error handling, logging, and configuration
8. **Scalability**: Easy to add new features following established patterns

## Next Steps

1. Add comprehensive test coverage
2. Add OpenTelemetry for distributed tracing
3. Add rate limiting middleware
4. Add caching layer with Redis
5. Add request/response validation schemas
6. Add API documentation generation
7. Add performance monitoring
8. Add health check endpoints

## Questions?

For questions or clarifications about this refactoring, please refer to:
- Individual file documentation (JSDoc comments)
- TypeScript types and interfaces
- Example usage in existing routes and actions
