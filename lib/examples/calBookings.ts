/**
 * Diverse booking examples for testing and development
 * Based on Cal.com API v2 booking response format
 */

import type { CalBooking } from "@/lib/schemas/calBookings";

/**
 * Example booking with "accepted" status
 */
export const acceptedBookingExample: CalBooking = {
  id: 123,
  uid: "booking_uid_123",
  title: "Consultation",
  description: "Learn how to integrate scheduling into marketplace.",
  hosts: [
    {
      id: 1,
      name: "Jane Doe",
      email: "jane100@example.com",
      username: "jane100",
      timeZone: "America/Los_Angeles",
    },
  ],
  status: "accepted",
  cancellationReason: null,
  cancelledByEmail: null,
  reschedulingReason: null,
  rescheduledByEmail: null,
  rescheduledFromUid: null,
  rescheduledToUid: null,
  start: "2024-08-13T15:30:00Z",
  end: "2024-08-13T16:30:00Z",
  duration: 60,
  eventTypeId: 50,
  eventType: {
    id: 1,
    slug: "some-event",
  },
  meetingUrl: "https://example.com/recurring-meeting",
  location: "https://example.com/meeting",
  absentHost: true,
  createdAt: "2024-08-13T15:30:00Z",
  updatedAt: "2024-08-13T15:30:00Z",
  metadata: {
    key: "value",
  },
  rating: 4,
  icsUid: "ics_uid_123",
  attendees: [
    {
      name: "John Doe",
      email: "john@example.com",
      timeZone: "America/New_York",
      language: "en",
      absent: false,
      phoneNumber: "+1234567890",
    },
  ],
  guests: ["guest1@example.com", "guest2@example.com"],
  bookingFieldsResponses: {
    customField: "customValue",
  },
};

/**
 * Example booking with "cancelled" status
 */
export const cancelledBookingExample: CalBooking = {
  id: 124,
  uid: "booking_uid_124",
  title: "Product Demo",
  description: "30-minute product demonstration for potential customer.",
  hosts: [
    {
      id: 2,
      name: "Bob Smith",
      email: "bob@example.com",
      username: "bobsmith",
      timeZone: "America/Chicago",
    },
  ],
  status: "cancelled",
  cancellationReason: "Customer no longer interested",
  cancelledByEmail: "customer@example.com",
  start: "2024-08-14T10:00:00Z",
  end: "2024-08-14T10:30:00Z",
  duration: 30,
  eventTypeId: 51,
  eventType: {
    id: 2,
    slug: "product-demo",
  },
  meetingUrl: "https://example.com/demo-meeting",
  location: "Zoom",
  absentHost: false,
  createdAt: "2024-08-10T09:00:00Z",
  updatedAt: "2024-08-12T14:30:00Z",
  metadata: {
    source: "website",
    campaign: "summer2024",
  },
  icsUid: "ics_uid_124",
  attendees: [
    {
      name: "Alice Johnson",
      email: "alice@company.com",
      timeZone: "America/Los_Angeles",
      language: "en",
      absent: false,
    },
  ],
  guests: [],
  bookingFieldsResponses: {
    company: "Acme Corp",
    employees: "50-100",
  },
};

/**
 * Example booking with "pending" status
 */
export const pendingBookingExample: CalBooking = {
  id: 125,
  uid: "booking_uid_125",
  title: "Technical Interview",
  description: "First round technical interview with engineering team.",
  hosts: [
    {
      id: 3,
      name: "Carol Wilson",
      email: "carol@example.com",
      username: "carolw",
      timeZone: "Europe/London",
    },
    {
      id: 4,
      name: "David Lee",
      email: "david@example.com",
      username: "davidlee",
      timeZone: "Europe/London",
    },
  ],
  status: "pending",
  start: "2024-08-15T14:00:00Z",
  end: "2024-08-15T15:30:00Z",
  duration: 90,
  eventTypeId: 52,
  eventType: {
    id: 3,
    slug: "technical-interview",
  },
  meetingUrl: "https://example.com/interview-room",
  location: "Google Meet",
  absentHost: false,
  createdAt: "2024-08-13T16:45:00Z",
  updatedAt: "2024-08-13T16:45:00Z",
  metadata: {
    jobTitle: "Senior Software Engineer",
    department: "Engineering",
  },
  rating: 0,
  icsUid: "ics_uid_125",
  attendees: [
    {
      name: "Mike Chen",
      email: "mike.chen@candidate.com",
      timeZone: "America/New_York",
      language: "en",
      absent: false,
      phoneNumber: "+1555123456",
    },
  ],
  guests: ["hr@example.com"],
  bookingFieldsResponses: {
    yearsOfExperience: "7",
    portfolio: "https://mikchen.dev",
  },
};

/**
 * Example booking with "rejected" status
 */
export const rejectedBookingExample: CalBooking = {
  id: 126,
  uid: "booking_uid_126",
  title: "Sales Call",
  description: "Initial sales consultation.",
  hosts: [
    {
      id: 5,
      name: "Emily Brown",
      email: "emily@example.com",
      username: "emilybrown",
      timeZone: "America/Denver",
    },
  ],
  status: "rejected",
  cancellationReason: "Outside business hours",
  start: "2024-08-16T22:00:00Z",
  end: "2024-08-16T22:45:00Z",
  duration: 45,
  eventTypeId: 53,
  eventType: {
    id: 4,
    slug: "sales-call",
  },
  meetingUrl: "https://example.com/sales-meeting",
  location: "Phone call",
  absentHost: false,
  createdAt: "2024-08-14T08:00:00Z",
  updatedAt: "2024-08-14T08:15:00Z",
  metadata: {
    leadScore: "cold",
  },
  icsUid: "ics_uid_126",
  attendees: [
    {
      name: "Sam Taylor",
      email: "sam@potential-customer.com",
      timeZone: "Asia/Tokyo",
      language: "en",
      absent: false,
      phoneNumber: "+81123456789",
    },
  ],
  guests: [],
  bookingFieldsResponses: {
    companySize: "1-10",
    industry: "Technology",
  },
};

/**
 * Example booking with "upcoming" status and minimal fields
 */
export const upcomingBookingExample: CalBooking = {
  id: 127,
  uid: "booking_uid_127",
  title: "Quick Check-in",
  description: "15-minute status update",
  hosts: [
    {
      id: 6,
      name: "Frank Miller",
      email: "frank@example.com",
      username: "frankmiller",
      timeZone: "America/New_York",
    },
  ],
  status: "upcoming",
  start: "2024-08-20T13:00:00Z",
  end: "2024-08-20T13:15:00Z",
  duration: 15,
  eventTypeId: 54,
  eventType: {
    id: 5,
    slug: "quick-checkin",
  },
  meetingUrl: "https://example.com/quick-meeting",
  location: "Zoom",
  absentHost: false,
  createdAt: "2024-08-13T10:00:00Z",
  updatedAt: "2024-08-13T10:00:00Z",
  metadata: {},
  icsUid: "ics_uid_127",
  attendees: [
    {
      name: "Grace Park",
      email: "grace@team.com",
      timeZone: "America/New_York",
      language: "en",
      absent: false,
    },
  ],
  guests: [],
  bookingFieldsResponses: {},
};

/**
 * Example booking with "accepted" status that was rescheduled
 */
export const rescheduledBookingExample: CalBooking = {
  id: 128,
  uid: "booking_uid_128_new",
  title: "Strategy Review",
  description: "Quarterly strategy review meeting that was rescheduled.",
  hosts: [
    {
      id: 7,
      name: "Helen Torres",
      email: "helen@example.com",
      username: "helent",
      timeZone: "America/New_York",
    },
  ],
  status: "accepted",
  cancellationReason: null,
  cancelledByEmail: null,
  reschedulingReason: "Conflict with another meeting",
  rescheduledByEmail: "helen@example.com",
  rescheduledFromUid: "booking_uid_128_old",
  rescheduledToUid: "booking_uid_128_new",
  start: "2024-08-22T15:00:00Z",
  end: "2024-08-22T16:00:00Z",
  duration: 60,
  eventTypeId: 55,
  eventType: {
    id: 6,
    slug: "strategy-review",
  },
  meetingUrl: "https://example.com/strategy-meeting",
  location: "Microsoft Teams",
  absentHost: false,
  createdAt: "2024-08-10T12:00:00Z",
  updatedAt: "2024-08-15T09:30:00Z",
  metadata: {
    quarter: "Q3",
    department: "Product",
  },
  rating: 0,
  icsUid: "ics_uid_128",
  attendees: [
    {
      name: "Ivan Martinez",
      email: "ivan@team.com",
      timeZone: "America/Chicago",
      language: "en",
      absent: false,
    },
  ],
  guests: [],
  bookingFieldsResponses: {},
};

/**
 * Example API response with new pagination format
 */
export const bookingApiResponseWithPagination = {
  status: "success",
  data: [
    acceptedBookingExample,
    cancelledBookingExample,
    pendingBookingExample,
    rejectedBookingExample,
  ],
  pagination: {
    totalItems: 123,
    remainingItems: 119,
    returnedItems: 4,
    itemsPerPage: 10,
    currentPage: 1,
    totalPages: 13,
    hasNextPage: true,
    hasPreviousPage: false,
  },
  error: {},
};

/**
 * Example API response for page 2
 */
export const bookingApiResponsePage2 = {
  status: "success",
  data: [upcomingBookingExample],
  pagination: {
    totalItems: 123,
    remainingItems: 103,
    returnedItems: 10,
    itemsPerPage: 10,
    currentPage: 2,
    totalPages: 13,
    hasNextPage: true,
    hasPreviousPage: true,
  },
  error: {},
};

/**
 * All example bookings in an array
 */
export const allBookingExamples: CalBooking[] = [
  acceptedBookingExample,
  cancelledBookingExample,
  pendingBookingExample,
  rejectedBookingExample,
  upcomingBookingExample,
  rescheduledBookingExample,
];
