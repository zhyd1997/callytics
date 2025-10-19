/**
 * Meeting type definition based on Cal.com API v2 structure
 * This type matches the data structure used in constants/meetings.ts
 */
export interface Meeting {
  id: number;
  uid: string;
  title: string;
  description: string;
  hosts: Array<{
    id: number;
    name: string;
    email: string;
    username: string;
    timeZone: string;
  }>;
  status: string;
  cancellationReason?: string;
  cancelledByEmail?: string;
  reschedulingReason?: string;
  rescheduledByEmail?: string;
  rescheduledFromUid?: string;
  rescheduledToUid?: string;
  start: string;
  end: string;
  duration: number;
  eventTypeId: number;
  eventType: {
    id: number;
    slug: string;
  };
  meetingUrl: string;
  location: string;
  absentHost: boolean;
  createdAt: string;
  updatedAt: string;
  metadata: {
    [key: string]: any;
  };
  rating: number;
  icsUid: string;
  attendees: Array<{
    name: string;
    email: string;
    timeZone: string;
    language: string;
    absent: boolean;
    phoneNumber?: string;
  }>;
  guests: string[];
  bookingFieldsResponses: {
    [key: string]: any;
  };
}
