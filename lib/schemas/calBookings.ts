import { z } from "zod";

const isoDateStringSchema = z
  .string()
  .min(1, "Expected ISO string")
  .refine((value) => !Number.isNaN(Date.parse(value)), {
    message: "Invalid ISO 8601 timestamp",
  });

export const bookingStatusSchema = z.enum([
  "upcoming",
  "recurring",
  "past",
  "cancelled",
  "unconfirmed",
  "accepted",
  "pending",
  "rejected",
  "completed",
]);

const sortOrderSchema = z.enum(["asc", "desc"]);

const toStringArray = (value: unknown): string[] | undefined => {
  if (typeof value === "undefined" || value === null) {
    return undefined;
  }

  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === "number" ? String(item) : String(item)))
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
};

export const calBookingsQuerySchema = z
  .object({
    status: z
      .preprocess(toStringArray, z.array(bookingStatusSchema).min(1))
      .optional(),
    attendeeEmail: z.string().email().optional(),
    attendeeName: z.string().min(1).optional(),
    bookingUid: z.string().min(1).optional(),
    eventTypeIds: z
      .preprocess(toStringArray, z.array(z.string().min(1)).min(1))
      .optional(),
    eventTypeId: z
      .preprocess(
        (value) => (typeof value === "number" ? String(value) : value),
        z.string().min(1),
      )
      .optional(),
    teamIds: z
      .preprocess(toStringArray, z.array(z.string().min(1)).min(1))
      .optional(),
    teamId: z
      .preprocess(
        (value) => (typeof value === "number" ? String(value) : value),
        z.string().min(1),
      )
      .optional(),
    afterStart: isoDateStringSchema.optional(),
    beforeEnd: isoDateStringSchema.optional(),
    afterCreatedAt: isoDateStringSchema.optional(),
    beforeCreatedAt: isoDateStringSchema.optional(),
    afterUpdatedAt: isoDateStringSchema.optional(),
    beforeUpdatedAt: isoDateStringSchema.optional(),
    sortStart: sortOrderSchema.optional(),
    sortEnd: sortOrderSchema.optional(),
    sortCreated: sortOrderSchema.optional(),
    sortUpdatedAt: sortOrderSchema.optional(),
    take: z
      .preprocess((value) => {
        if (typeof value === "string") {
          return value.trim().length ? Number(value) : undefined;
        }
        return value;
      }, z.number().int().positive().max(500))
      .optional(),
    skip: z
      .preprocess((value) => {
        if (typeof value === "string") {
          return value.trim().length ? Number(value) : undefined;
        }
        return value;
      }, z.number().int().min(0))
      .optional(),
  })
  .strict();

const bookingHostSchema = z.object({
  id: z.number(),
  name: z.string(),
  email: z.string().email(),
  username: z.string(),
  timeZone: z.string(),
});

const bookingAttendeeSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  timeZone: z.string(),
  language: z.string(),
  absent: z.boolean().optional(),
  phoneNumber: z.string().optional(),
});

export const calBookingSchema = z.object({
  id: z.number(),
  uid: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  hosts: z.array(bookingHostSchema),
  status: bookingStatusSchema,
  cancellationReason: z.string().nullable().optional(),
  cancelledByEmail: z.string().nullable().optional(),
  reschedulingReason: z.string().nullable().optional(),
  rescheduledByEmail: z.string().nullable().optional(),
  rescheduledFromUid: z.string().nullable().optional(),
  rescheduledToUid: z.string().nullable().optional(),
  start: isoDateStringSchema,
  end: isoDateStringSchema,
  duration: z.number().nonnegative(),
  eventTypeId: z.number(),
  eventType: z.object({
    id: z.number(),
    slug: z.string(),
  }),
  meetingUrl: z.string().url(),
  location: z.string().nullable().optional(),
  absentHost: z.boolean().optional(),
  createdAt: isoDateStringSchema,
  updatedAt: isoDateStringSchema,
  metadata: z.record(z.string(), z.unknown()).optional(),
  rating: z.number().optional(),
  icsUid: z.string().nullable().optional(),
  attendees: z.array(bookingAttendeeSchema).optional(),
  guests: z.array(z.string().email()).optional(),
  bookingFieldsResponses: z.record(z.string(), z.unknown()).optional(),
});

const rawBookingsArraySchema = z.array(calBookingSchema);

const paginationSchema = z.object({
  totalItems: z.number(),
  remainingItems: z.number(),
  returnedItems: z.number(),
  itemsPerPage: z.number(),
  currentPage: z.number(),
  totalPages: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

const rawBookingsEnvelopeSchema = z
  .object({
    data: rawBookingsArraySchema,
    count: z.number().optional(),
    totalCount: z.number().optional(),
    nextCursor: z.union([z.string(), z.number()]).nullish(),
    prevCursor: z.union([z.string(), z.number()]).nullish(),
  })
  .loose();

const rawBookingsEnvelopeAltSchema = z
  .object({
    bookings: rawBookingsArraySchema,
    meta: z
      .object({
        total: z.number().optional(),
        count: z.number().optional(),
        nextCursor: z.union([z.string(), z.number()]).nullish(),
        prevCursor: z.union([z.string(), z.number()]).nullish(),
      })
      .partial()
      .optional(),
  })
  .loose();

const rawBookingsWithPaginationSchema = z
  .object({
    status: z.string(),
    data: rawBookingsArraySchema,
    pagination: paginationSchema,
    error: z.record(z.string(), z.unknown()),
  })
  .loose();

export const calBookingsResponseSchema = z.union([
  rawBookingsArraySchema,
  rawBookingsEnvelopeSchema,
  rawBookingsEnvelopeAltSchema,
  rawBookingsWithPaginationSchema,
]);

export type CalBookingStatus = z.infer<typeof bookingStatusSchema>;
export type CalBooking = z.infer<typeof calBookingSchema>;
export type CalBookingsQuery = z.infer<typeof calBookingsQuerySchema>;

export const fetchCalBookingsActionSchema = z.object({
  userId: z.string(),
  query: calBookingsQuerySchema.optional(),
  baseUrl: z.string().url().optional(),
  apiVersion: z.string().min(1).optional(),
});

export type FetchCalBookingsActionInput = z.infer<typeof fetchCalBookingsActionSchema>;
