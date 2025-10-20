import type { MeetingRecord } from '@/lib/types/meeting';

/**
 * Filters out meetings where the host and the only attendee are the same person.
 * A meeting is considered a "self-meeting" if:
 * 1. There is exactly one attendee
 * 2. The attendee's email matches any of the hosts' emails
 * 
 * @param meetings - Array of meeting objects
 * @returns Filtered array of meetings excluding self-meetings
 * 
 * @example
 * const filteredMeetings = removeSelfMeetings(meetingData.data);
 */
export function removeSelfMeetings(meetings: readonly MeetingRecord[]): MeetingRecord[] {
  return meetings.filter((meeting) => {
    // If there are no attendees or more than one attendee, keep the meeting
    if (!meeting.attendees || meeting.attendees.length !== 1) {
      return true;
    }

    // If there are no hosts, keep the meeting
    if (!meeting.hosts || meeting.hosts.length === 0) {
      return true;
    }

    const attendeeEmail = meeting.attendees[0].email.toLowerCase().trim();
    
    // Check if the single attendee's email matches any host's email
    const isSelfMeeting = meeting.hosts.some(
      (host) => host.email.toLowerCase().trim() === attendeeEmail
    );

    // Return true to keep the meeting (when it's NOT a self-meeting)
    return !isSelfMeeting;
  });
}

/**
 * Gets the count of self-meetings (meetings where host and only attendee are the same).
 * 
 * @param meetings - Array of meeting objects
 * @returns Number of self-meetings
 */
export function countSelfMeetings(meetings: readonly MeetingRecord[]): number {
  return meetings.length - removeSelfMeetings(meetings).length;
}

/**
 * Checks if a single meeting is a self-meeting.
 * 
 * @param meeting - A meeting object
 * @returns True if the meeting is a self-meeting, false otherwise
 */
export function isSelfMeeting(meeting: MeetingRecord): boolean {
  if (!meeting.attendees || meeting.attendees.length !== 1) {
    return false;
  }

  if (!meeting.hosts || meeting.hosts.length === 0) {
    return false;
  }

  const attendeeEmail = meeting.attendees[0].email.toLowerCase().trim();
  
  return meeting.hosts.some(
    (host) => host.email.toLowerCase().trim() === attendeeEmail
  );
}
