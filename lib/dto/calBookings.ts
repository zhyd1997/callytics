import type { CalBooking, CalBookingStatus, CalBookingsQuery } from "@/lib/schemas/calBookings";
import {
  fetchCalBookings,
  type FetchCalBookingsOptions,
  type CalBookingsApiError,
} from "@/lib/dal/calBookings";
import type { Meeting, MeetingRecord, MeetingsPagination } from "@/lib/types/meeting";
import { TOP_UPDATED_BOOKINGS_LIMIT, BOOKING_SUMMARY_FETCH_LIMIT } from "@/lib/constants/bookings";

export type NormalizedCalBookingsResponse = {
  items: readonly CalBooking[];
  totalCount?: number;
  nextCursor?: string | number | null;
  prevCursor?: string | number | null;
  raw: unknown;
};

const CAL_BOOKING_STATUS_VALUES = [
  "upcoming",
  "recurring",
  "past",
  "cancelled",
  "unconfirmed",
  "accepted",
  "pending",
  "rejected",
  "completed",
] as const satisfies readonly CalBookingStatus[];

const CAL_BOOKING_STATUS_SET = new Set<string>(CAL_BOOKING_STATUS_VALUES);

const isValidCalBookingStatus = (value: unknown): value is CalBookingStatus =>
  typeof value === "string" && CAL_BOOKING_STATUS_SET.has(value);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isBookingsArray = (value: unknown): value is CalBooking[] => {
  return (
    Array.isArray(value) &&
    value.every((booking) => isRecord(booking) && typeof booking.id === "number")
  );
};

type CalBookingsEnvelope =
  | {
      readonly data: CalBooking[];
      readonly totalCount?: number;
      readonly count?: number;
      readonly nextCursor?: string | number | null;
      readonly prevCursor?: string | number | null;
    }
  | {
      readonly bookings: CalBooking[];
      readonly meta?: {
        readonly total?: number;
        readonly count?: number;
        readonly nextCursor?: string | number | null;
        readonly prevCursor?: string | number | null;
      };
    };

const isBookingsEnvelope = (value: unknown): value is CalBookingsEnvelope => {
  if (!isRecord(value)) {
    return false;
  }

  if ("data" in value && isBookingsArray(value.data)) {
    return true;
  }

  if ("bookings" in value && isBookingsArray(value.bookings)) {
    return true;
  }

  return false;
};

export const normalizeCalBookingsResponse = (
  payload: unknown,
): NormalizedCalBookingsResponse => {
  if (isBookingsArray(payload)) {
    return {
      items: payload,
      raw: payload,
    };
  }

  if (isBookingsEnvelope(payload)) {
    if ("data" in payload) {
      return {
        items: payload.data,
        totalCount: payload.totalCount ?? payload.count,
        nextCursor: payload.nextCursor ?? null,
        prevCursor: payload.prevCursor ?? null,
        raw: payload,
      };
    }

    return {
      items: payload.bookings,
      totalCount: payload.meta?.total ?? payload.meta?.count,
      nextCursor: payload.meta?.nextCursor ?? null,
      prevCursor: payload.meta?.prevCursor ?? null,
      raw: payload,
    };
  }

  console.error("Unexpected Cal.com bookings payload received", payload);
  throw new Error("Unsupported Cal.com bookings response shape.");
};

export const mapCalBookingToMeetingRecord = (booking: CalBooking): MeetingRecord => {
  const eventType = booking?.eventType;
  const normalizedHosts = Array.isArray(booking?.hosts)
    ? booking.hosts.map((host) => ({ ...host }))
    : [];
  const normalizedAttendees = Array.isArray(booking?.attendees)
    ? booking.attendees.map((attendee) => ({
        ...attendee,
        absent: attendee?.absent ?? false,
      }))
    : [];
  const normalizedGuests = Array.isArray(booking?.guests) ? booking.guests : [];

  return {
    id: typeof booking.id === "number" ? booking.id : 0,
    uid: booking.uid ?? "",
    title: booking.title ?? "",
    description: booking.description ?? "",
    hosts: normalizedHosts,
    status: typeof booking.status === "string" ? booking.status : "pending",
    cancellationReason: booking.cancellationReason ?? undefined,
    cancelledByEmail: booking.cancelledByEmail ?? undefined,
    reschedulingReason: booking.reschedulingReason ?? undefined,
    rescheduledByEmail: booking.rescheduledByEmail ?? undefined,
    rescheduledFromUid: booking.rescheduledFromUid ?? undefined,
    rescheduledToUid: booking.rescheduledToUid ?? undefined,
    start: booking.start ?? "",
    end: booking.end ?? "",
    duration: booking.duration ?? 0,
    eventTypeId: booking.eventTypeId ?? (typeof eventType?.id === "number" ? eventType.id : 0),
    eventType: {
      id:
        typeof eventType?.id === "number"
          ? eventType.id
          : typeof booking.eventTypeId === "number"
            ? booking.eventTypeId
            : 0,
      slug: typeof eventType?.slug === "string" ? eventType.slug : "",
    },
    meetingUrl: booking.meetingUrl ?? "",
    location: booking.location ?? "",
    absentHost: booking.absentHost ?? false,
    createdAt: booking.createdAt ?? "",
    updatedAt: booking.updatedAt ?? "",
    metadata: (booking.metadata as Record<string, unknown> | undefined) ?? {},
    rating: booking.rating ?? 0,
    icsUid: booking.icsUid ?? "",
    attendees: normalizedAttendees,
    guests: normalizedGuests,
    bookingFieldsResponses:
      (booking.bookingFieldsResponses as Record<string, unknown> | undefined) ?? {},
  };
};

export const mapCalBookingsToMeetingCollection = (
  bookings: readonly CalBooking[],
): readonly MeetingRecord[] => bookings.map(mapCalBookingToMeetingRecord);

const buildMeetingsPagination = (
  totalItems: number,
  returnedItems: number,
  query?: CalBookingsQuery,
): MeetingsPagination => {
  const take = typeof query?.take === "number" && query.take > 0 ? query.take : undefined;
  const skip = typeof query?.skip === "number" && query.skip >= 0 ? query.skip : 0;
  const itemsPerPage =
    take ?? (returnedItems > 0 ? returnedItems : totalItems > 0 ? totalItems : 0);
  const divisor = itemsPerPage > 0 ? itemsPerPage : 1;
  const currentPage = Math.floor(skip / divisor);
  const totalPages = divisor > 0 ? Math.max(Math.ceil(totalItems / divisor), 1) : 1;
  const remainingItems = Math.max(totalItems - (skip + returnedItems), 0);
  const hasNextPage = skip + returnedItems < totalItems;
  const hasPreviousPage = skip > 0;

  return {
    totalItems,
    remainingItems,
    returnedItems,
    itemsPerPage,
    currentPage,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };
};

export const mapNormalizedCalBookingsToMeeting = (
  result: NormalizedCalBookingsResponse,
  query?: CalBookingsQuery,
): Meeting => {
  const totalItems =
    typeof result.totalCount === "number" ? result.totalCount : result.items.length;
  const meetingData = mapCalBookingsToMeetingCollection(result.items);

  return {
    status: "success",
    data: meetingData,
    pagination: buildMeetingsPagination(totalItems, meetingData.length, query),
    error: {},
  };
};

export const fetchNormalizedCalBookings = async (
  options: FetchCalBookingsOptions,
): Promise<NormalizedCalBookingsResponse> => {
  try {
    const payload = await fetchCalBookings(options);
    return normalizeCalBookingsResponse(payload);
  } catch (error) {
    console.error("Failed to fetch normalized Cal.com bookings", error);
    throw error;
  }
};

export type FetchCalBookingSummaryByStatusOptions = Omit<
  FetchCalBookingsOptions,
  "query"
> & {
  readonly status: CalBookingStatus | string;
};

export type CalBookingStatusSummary = {
  readonly status: CalBookingStatus;
  readonly totalItems: number;
};

export const fetchCalBookingSummaryByStatus = async (
  options: FetchCalBookingSummaryByStatusOptions,
): Promise<CalBookingStatusSummary> => {
  try {
    const { status, ...rest } = options;
    if (!isValidCalBookingStatus(status)) {
      throw new Error(`Unsupported Cal.com booking status: ${String(status)}`);
    }
    const validatedStatus = status;

    const result = await fetchNormalizedCalBookings({
      ...rest,
      query: {
        status: [validatedStatus],
        take: BOOKING_SUMMARY_FETCH_LIMIT,
      },
    });

    const totalItems =
      typeof result.totalCount === "number" ? result.totalCount : result.items.length;

    return {
      status: validatedStatus,
      totalItems,
    };
  } catch (error) {
    console.error("Failed to summarize Cal.com bookings by status", error);
    throw error;
  }
};

export type FetchTopUpdatedBookingsOptions = Omit<
  FetchCalBookingsOptions,
  "query"
> & {
  readonly query?: Omit<CalBookingsQuery, "take" | "sortUpdatedAt">;
};

export type FetchTopUpdatedBookingsResult = {
  readonly data: readonly CalBooking[] | null;
  readonly totalItems: number | null;
  readonly error: CalBookingsApiError | Error | null;
};

export const fetchTopUpdatedBookings = async (
  options: FetchTopUpdatedBookingsOptions,
): Promise<FetchTopUpdatedBookingsResult> => {
  const { query, ...rest } = options;

  try {
    const normalizedQuery = {
      ...(query ?? {}),
      sortUpdatedAt: "desc" as const,
      take: TOP_UPDATED_BOOKINGS_LIMIT,
    } satisfies CalBookingsQuery;

    const result = await fetchNormalizedCalBookings({
      ...rest,
      query: normalizedQuery,
    });

    const totalItems =
      typeof result.totalCount === "number" ? result.totalCount : result.items.length;

    return {
      data: result.items,
      totalItems,
      error: null,
    };
  } catch (error) {
    console.error("Failed to fetch top updated bookings", error);
    return {
      data: null,
      totalItems: null,
      error: error as CalBookingsApiError | Error,
    };
  }
};
