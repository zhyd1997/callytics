# Library (lib) Directory Structure

This directory contains the core application infrastructure, utilities, and reusable modules organized by responsibility.

## Directory Organization

```
lib/
??? api/              # API utilities and response formatting
??? auth/             # Authentication helpers
??? config/           # Configuration and environment management
??? constants/        # Application-wide constants
??? dal/              # Data Access Layer (legacy, prefer repositories)
??? dto/              # Data Transfer Objects and transformations
??? errors/           # Error classes and error handling
??? logging/          # Logging service and utilities
??? middleware/       # Reusable middleware (auth, validation)
??? repositories/     # Data access repositories (new pattern)
??? schemas/          # Zod validation schemas
??? services/         # Business logic services
??? types/            # TypeScript type definitions
??? utils/            # General utility functions
??? *.ts              # Root-level modules (auth, prisma, etc.)
```

## Key Modules

### `/api` - API Utilities
- `response.ts` - Standardized API response formatting
  - Success/error response types
  - Response helper functions
  - Pagination utilities

### `/config` - Configuration
- `env.ts` - Environment variable validation and access
  - Type-safe configuration
  - URL building utilities
  - Environment checks

### `/errors` - Error Handling
- `index.ts` - Error classes and factory
  - `AppError` base class
  - Specific error types (Authentication, Validation, etc.)
  - `ErrorFactory` for creating errors
  - Error serialization utilities

### `/logging` - Logging
- `logger.ts` - Structured logging service
  - Multiple log levels
  - Contextual logging
  - Child loggers with namespaces
  - Environment-aware formatting

### `/middleware` - Middleware
- `auth.ts` - Authentication middleware
  - Session validation
  - Token extraction
  - Resource access control
- `validation.ts` - Validation middleware
  - Schema validation with Result pattern
  - Pagination validation
  - Validation utilities

### `/repositories` - Data Access
- `cal-bookings.repository.ts` - Cal.com API data access
  - Repository pattern implementation
  - Configurable and testable
  - Result-based error handling

### `/services` - Business Logic
- `cal-bookings.service.ts` - Bookings business logic
  - Service layer implementation
  - Orchestrates repositories and DTOs
  - Implements business rules

### `/utils` - Utilities
- `result.ts` - Result type pattern
  - Functional error handling
  - Type-safe success/failure
  - Composition utilities

### `/constants` - Constants
- `index.ts` - Application constants
  - HTTP status codes
  - Pagination defaults
  - Timeouts and cache controls
  - Common regex patterns

## Usage Patterns

### Configuration
```typescript
import { env, buildAppUrl } from '@/lib/config/env';
const apiUrl = env.CAL_API_BASE_URL;
```

### Error Handling
```typescript
import { ErrorFactory } from '@/lib/errors';
throw ErrorFactory.validation('Invalid input', details);
```

### Logging
```typescript
import { createLogger } from '@/lib/logging/logger';
const logger = createLogger('module-name');
logger.info('Operation completed', { userId: 123 });
```

### Authentication
```typescript
import { requireAuth } from '@/lib/middleware/auth';
const authResult = await requireAuth(userId);
```

### Validation
```typescript
import { validate } from '@/lib/middleware/validation';
const result = validate(schema, data);
```

### Service Layer
```typescript
import { calBookingsService } from '@/lib/services/cal-bookings.service';
const result = await calBookingsService.fetchBookings(options);
```

### Result Pattern
```typescript
import { ok, err, isOk } from '@/lib/utils/result';
if (isOk(result)) {
  // Handle success
} else {
  // Handle error
}
```

## Architecture Principles

1. **Separation of Concerns**: Each directory has a single, well-defined responsibility
2. **Dependency Direction**: Upper layers depend on lower layers, never the reverse
3. **Type Safety**: Strong typing throughout with TypeScript
4. **Error Handling**: Explicit error handling with Result pattern and error classes
5. **Testability**: Dependencies injected for easy mocking and testing
6. **Reusability**: Modular design enables code reuse across the application

## Testing

Each module should have corresponding test files:
- Unit tests for utilities and pure functions
- Integration tests for services and repositories
- Mocked dependencies for isolated testing

## Contributing

When adding new code to `/lib`:

1. Choose the appropriate directory based on responsibility
2. Follow existing patterns and conventions
3. Add JSDoc comments for public APIs
4. Use the established error handling patterns
5. Add logging for important operations
6. Ensure type safety with TypeScript
7. Update this README if adding new directories or major modules

## Related Documentation

- See `REFACTORING.md` for the refactoring rationale
- See individual file JSDoc comments for detailed API documentation
- See type definitions in `/lib/types` for data structures
