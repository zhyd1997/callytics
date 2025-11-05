# Cal.com Booking Examples

This directory contains diverse booking examples for testing and development purposes, based on the Cal.com API v2 booking response format.

## Available Examples

### Individual Booking Examples

Each example demonstrates a different booking status with realistic data:

1. **`acceptedBookingExample`** - Status: `accepted`
   - 60-minute consultation meeting
   - Includes cancellation and rescheduling fields
   - Multiple attendees and guests
   - Rating and metadata

2. **`cancelledBookingExample`** - Status: `cancelled`
   - 30-minute product demo that was cancelled
   - Includes cancellation reason and who cancelled
   - Demonstrates metadata for tracking (source, campaign)
   - Custom booking field responses

3. **`pendingBookingExample`** - Status: `pending`
   - 90-minute technical interview
   - Multiple hosts
   - Job-related metadata
   - Phone numbers for attendees

4. **`rejectedBookingExample`** - Status: `rejected`
   - 45-minute sales call that was rejected
   - Outside business hours scenario
   - International attendee (Asia/Tokyo timezone)
   - Lead tracking metadata

5. **`upcomingBookingExample`** - Status: `upcoming`
   - 15-minute quick check-in
   - Minimal fields example
   - Clean baseline for testing

### API Response Examples

#### `bookingApiResponseWithPagination`
Complete API response following the new pagination format with:
- Status: `"success"`
- Data array containing 4 diverse bookings
- Full pagination object with:
  - `totalItems`: 123
  - `remainingItems`: 119
  - `returnedItems`: 4
  - `itemsPerPage`: 10
  - `currentPage`: 1
  - `totalPages`: 13
  - `hasNextPage`: true
  - `hasPreviousPage`: false
- Empty error object

#### `bookingApiResponsePage2`
Example of page 2 response demonstrating:
- Navigation through paginated results
- Different cursor positions (page 2)
- Both previous and next page available

## Usage

### In Tests
```typescript
import {
  acceptedBookingExample,
  bookingApiResponseWithPagination
} from '@/lib/examples/calBookings';

// Test booking normalization
const normalized = normalizeCalBookingsResponse(bookingApiResponseWithPagination);

// Test individual booking processing
processBooking(acceptedBookingExample);
```

### In Development
```typescript
import { allBookingExamples } from '@/lib/examples/calBookings';

// Mock data for UI development
const mockBookings = allBookingExamples;
```

## Booking Statuses Covered

All examples include the following booking statuses as required:
- ✅ `cancelled` - Booking was cancelled
- ✅ `accepted` - Booking was accepted
- ✅ `rejected` - Booking was rejected
- ✅ `pending` - Booking is awaiting confirmation

Additional statuses also supported:
- `upcoming` - Future scheduled meeting
- `recurring` - Recurring meeting instance
- `past` - Completed meeting
- `unconfirmed` - Awaiting confirmation
- `completed` - Meeting finished

## Schema Validation

All examples are validated against the Zod schemas defined in:
- `lib/schemas/calBookings.ts` - For individual bookings
- `lib/dto/calBookings.ts` - For response normalization

The examples ensure compatibility with:
1. Original Cal.com API format
2. New pagination format (as of this update)
3. Alternative envelope formats

## Diversity Notes

The examples demonstrate diversity in:

- **Meeting Types**: Consultation, Demo, Interview, Sales Call, Check-in
- **Durations**: 15 min to 90 min
- **Timezones**: America/Los_Angeles, America/Chicago, America/New_York, America/Denver, Europe/London, Asia/Tokyo
- **Host Count**: Single host and multiple hosts
- **Attendee Details**: With/without phone numbers, different languages
- **Guests**: With/without guest lists
- **Metadata**: Various tracking fields (source, campaign, job details, lead score)
- **Custom Fields**: Company info, experience level, portfolio links
- **Cancellation/Rescheduling**: Examples with and without these scenarios
- **Ratings**: Different rating values including 0 (no rating)

## Pagination Format

The new pagination format includes comprehensive metadata:

```typescript
{
  totalItems: number;        // Total items across all pages
  remainingItems: number;    // Items remaining after current page
  returnedItems: number;     // Items in current response
  itemsPerPage: number;      // Items per page setting
  currentPage: number;       // Current page number
  totalPages: number;        // Total number of pages
  hasNextPage: boolean;      // Whether next page exists
  hasPreviousPage: boolean;  // Whether previous page exists
}
```

This format provides complete information for:
- Building pagination UI
- Calculating progress
- Implementing infinite scroll
- Showing result counts

## Related Files

- `lib/schemas/calBookings.ts` - Zod schemas for validation
- `lib/dto/calBookings.ts` - Data transformation and normalization
- `lib/dal/calBookings.ts` - Data access layer for fetching bookings
- `lib/types/meeting.ts` - TypeScript type definitions
