/**
 * UI Constants
 * Centralized configuration for animations, delays, and durations
 */

/**
 * Animation durations in seconds
 */
export const ANIMATION_DURATIONS = {
  /** Quick animations like button hovers */
  FAST: 0.15,
  /** Standard UI transitions */
  NORMAL: 0.3,
  /** Slower transitions for emphasis */
  SLOW: 0.5,
  /** Very slow transitions for major changes */
  VERY_SLOW: 1.0,
  /** Number counter animations */
  NUMBER_COUNTER: 1.5,
} as const;

/**
 * Animation delays in seconds
 */
export const ANIMATION_DELAYS = {
  /** No delay */
  NONE: 0,
  /** Short delay between staggered animations */
  SHORT: 0.1,
  /** Medium delay */
  MEDIUM: 0.2,
  /** Long delay */
  LONG: 0.3,
} as const;

/**
 * Breakpoints for responsive design (in pixels)
 */
export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
  '2XL': 1536,
} as const;

/**
 * Z-index layers
 */
export const Z_INDEX = {
  BASE: 0,
  DROPDOWN: 10,
  STICKY: 20,
  FIXED: 30,
  MODAL_BACKDROP: 40,
  MODAL: 50,
  POPOVER: 60,
  TOOLTIP: 70,
} as const;

/**
 * Grid configuration
 */
export const GRID = {
  /** Max width for centered content */
  MAX_WIDTH: '7xl',
  /** Gap between grid items */
  GAP: 4,
  /** Columns for stat cards on mobile */
  STATS_COLS_MOBILE: 2,
  /** Columns for stat cards on desktop */
  STATS_COLS_DESKTOP: 4,
} as const;

