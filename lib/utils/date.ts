import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime from 'dayjs/plugin/relativeTime';
import calendar from 'dayjs/plugin/calendar';

// Configure dayjs plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(calendar);

/**
 * Format a date string to show relative time (e.g., "today", "yesterday")
 * or formatted date for older dates
 * 
 * @param dateString - ISO date string
 * @returns Formatted date string
 * 
 * @example
 * formatRelativeDate('2025-11-19T10:00:00Z') // "Today"
 * formatRelativeDate('2025-11-18T10:00:00Z') // "Yesterday"
 * formatRelativeDate('2025-11-10T10:00:00Z') // "Nov 10, 2025"
 */
export function formatRelativeDate(dateString: string): string {
  const date = dayjs(dateString);
  const now = dayjs();
  
  // Check if today
  if (date.isSame(now, 'day')) {
    return 'Today';
  }
  
  // Check if yesterday
  if (date.isSame(now.subtract(1, 'day'), 'day')) {
    return 'Yesterday';
  }
  
  // Check if tomorrow
  if (date.isSame(now.add(1, 'day'), 'day')) {
    return 'Tomorrow';
  }
  
  // Check if within the last 7 days
  if (date.isAfter(now.subtract(7, 'day'))) {
    return date.format('dddd'); // Day name (e.g., "Monday")
  }
  
  // For older dates, show formatted date
  return date.format('MMM D, YYYY');
}

/**
 * Format a date string to display full date information
 * 
 * @param dateString - ISO date string
 * @returns Formatted date string like "Monday, November 19, 2025"
 */
export function formatFullDate(dateString: string): string {
  return dayjs(dateString).format('dddd, MMMM D, YYYY');
}

/**
 * Format a date string to display short date
 * 
 * @param dateString - ISO date string
 * @returns Formatted date string like "Nov 19, 2025"
 */
export function formatShortDate(dateString: string): string {
  return dayjs(dateString).format('MMM D, YYYY');
}

/**
 * Format a time string
 * 
 * @param dateString - ISO date string
 * @returns Formatted time string like "10:30 AM"
 */
export function formatTime(dateString: string): string {
  return dayjs(dateString).format('h:mm A');
}

/**
 * Format a time string with timezone
 * 
 * @param dateString - ISO date string
 * @param timezone - Optional timezone identifier
 * @returns Formatted time string with timezone like "10:30 AM PST"
 */
export function formatTimeWithZone(dateString: string, timezone?: string): string {
  if (timezone) {
    return dayjs(dateString).tz(timezone).format('h:mm A z');
  }
  return dayjs(dateString).format('h:mm A z');
}

/**
 * Format a month and year for charts/displays
 * 
 * @param dateString - ISO date string
 * @returns Formatted string like "Nov 2025"
 */
export function formatMonthYear(dateString: string): string {
  return dayjs(dateString).format('MMM YYYY');
}

/**
 * Check if a date is in the future
 * 
 * @param dateString - ISO date string
 * @returns True if date is in the future
 */
export function isFutureDate(dateString: string): boolean {
  return dayjs(dateString).isAfter(dayjs());
}

/**
 * Check if a date is in the past
 * 
 * @param dateString - ISO date string
 * @returns True if date is in the past
 */
export function isPastDate(dateString: string): boolean {
  return dayjs(dateString).isBefore(dayjs());
}

/**
 * Check if two dates are on the same day
 * 
 * @param date1 - First ISO date string
 * @param date2 - Second ISO date string
 * @returns True if dates are on the same day
 */
export function isSameDay(date1: string, date2: string): boolean {
  return dayjs(date1).isSame(dayjs(date2), 'day');
}
