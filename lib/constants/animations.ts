/**
 * Reusable animation configurations for motion components
 */

import type { Variants, Transition } from 'motion/react';

// Standard animation duration
export const ANIMATION_DURATION = 0.5;

// Fade in from top animation
export const fadeInFromTop: Variants = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
};

// Fade in from bottom animation
export const fadeInFromBottom: Variants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

// Fade in from left animation
export const fadeInFromLeft: Variants = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
};

// Fade in from right animation
export const fadeInFromRight: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
};

// Scale animation
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
};

// Helper function to create transition with delay
export const createTransition = (delay = 0): Transition => ({
  duration: ANIMATION_DURATION,
  delay,
});
