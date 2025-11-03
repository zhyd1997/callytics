type MeetingStatus =
  | "upcoming"
  | "recurring"
  | "past"
  | "cancelled"
  | "unconfirmed"
  | "accepted"
  | "pending"
  | "rejected"
  | "completed";

export interface MeetingHost {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly username: string;
  readonly timeZone: string;
}

export interface MeetingAttendee {
  readonly name: string;
  readonly email: string;
  readonly timeZone: string;
  readonly language: string;
  readonly absent: boolean;
  readonly phoneNumber?: string;
}

export interface MeetingEventType {
  readonly id: number;
  readonly slug: string;
}

export interface MeetingItem {
  readonly id: number;
  readonly uid: string;
  readonly title: string;
  readonly description: string;
  readonly hosts: readonly MeetingHost[];
  readonly status: MeetingStatus | string;
  readonly cancellationReason?: string;
  readonly cancelledByEmail?: string;
  readonly reschedulingReason?: string;
  readonly rescheduledByEmail?: string;
  readonly rescheduledFromUid?: string;
  readonly rescheduledToUid?: string;
  readonly start: string;
  readonly end: string;
  readonly duration: number;
  readonly eventTypeId: number;
  readonly eventType: MeetingEventType;
  readonly meetingUrl: string;
  readonly location: string;
  readonly absentHost: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly metadata: Record<string, unknown>;
  readonly rating: number;
  readonly icsUid: string;
  readonly attendees: readonly MeetingAttendee[];
  readonly guests: readonly string[];
  readonly bookingFieldsResponses: Record<string, unknown>;
}

export interface MeetingsPagination {
  readonly totalItems: number;
  readonly remainingItems: number;
  readonly returnedItems: number;
  readonly itemsPerPage: number;
  readonly currentPage: number;
  readonly totalPages: number;
  readonly hasNextPage: boolean;
  readonly hasPreviousPage: boolean;
}

export interface Meeting {
  readonly status: "success" | "error";
  readonly data: readonly MeetingItem[];
  readonly pagination: MeetingsPagination;
  readonly error: Record<string, unknown> | null;
  readonly statusCode?: number; // HTTP status code for monitoring
}

export type MeetingCollection = Meeting["data"];
export type MeetingRecord = Meeting["data"][number];
