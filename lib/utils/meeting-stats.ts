/**
 * Utility functions for calculating meeting statistics
 */

import type { MeetingRecord } from '@/lib/types/meeting';

/**
 * Meeting statistics interface
 */
export interface MeetingStats {
  readonly total: number;
  readonly accepted: number;
  readonly cancelled: number;
  readonly pending: number;
  readonly totalHours: number;
  readonly acceptanceRate: number;
}

/**
 * Calculates comprehensive meeting statistics
 * @param meetings - Array of meeting records
 * @returns Calculated statistics object
 */
export function calculateMeetingStats(meetings: readonly MeetingRecord[]): MeetingStats {
  const total = meetings.length;
  const accepted = meetings.filter(meeting => meeting.status === 'accepted').length;
  const cancelled = meetings.filter(meeting => meeting.status === 'cancelled').length;
  const pending = meetings.filter(meeting => meeting.status === 'pending').length;
  const totalHours = meetings.reduce((acc, meeting) => acc + meeting.duration, 0) / 60;
  const acceptanceRate = total > 0 ? Math.round((accepted / total) * 100) : 0;

  return {
    total,
    accepted,
    cancelled,
    pending,
    totalHours,
    acceptanceRate,
  };
}

/**
 * Filters meetings by status
 * @param meetings - Array of meeting records
 * @param status - Status to filter by
 * @returns Filtered array of meetings
 */
export function filterMeetingsByStatus(
  meetings: readonly MeetingRecord[],
  status: string
): MeetingRecord[] {
  return meetings.filter(meeting => meeting.status === status);
}

/**
 * Calculates total duration in hours
 * @param meetings - Array of meeting records
 * @returns Total duration in hours
 */
export function calculateTotalHours(meetings: readonly MeetingRecord[]): number {
  return meetings.reduce((acc, meeting) => acc + meeting.duration, 0) / 60;
}

/**
 * Calculates average duration in minutes
 * @param meetings - Array of meeting records
 * @returns Average duration in minutes
 */
export function calculateAverageDuration(meetings: readonly MeetingRecord[]): number {
  if (meetings.length === 0) return 0;
  const total = meetings.reduce((acc, meeting) => acc + meeting.duration, 0);
  return total / meetings.length;
}

/**
 * Groups meetings by status
 * @param meetings - Array of meeting records
 * @returns Object with status counts
 */
export function groupMeetingsByStatus(
  meetings: readonly MeetingRecord[]
): Record<string, number> {
  return meetings.reduce((acc, meeting) => {
    const status = meeting.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

