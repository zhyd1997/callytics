/**
 * Custom hook for animated number transitions
 * Provides smooth number animations with easing and in-view detection
 */

import { useEffect, useState } from 'react';

interface UseAnimatedNumberOptions {
  /** Target value to animate to */
  value: number;
  /** Animation duration in seconds */
  duration: number;
  /** Number of decimal places to display */
  decimals: number;
  /** Whether the component is in view */
  isInView: boolean;
}

interface UseAnimatedNumberResult {
  /** Current display value */
  displayValue: number;
  /** Formatted string value */
  formattedValue: string;
}

/**
 * Animates a number from 0 to target value with easing
 * @param options - Configuration options
 * @returns Current display value and formatted string
 */
export function useAnimatedNumber({
  value,
  duration,
  decimals,
  isInView,
}: UseAnimatedNumberOptions): UseAnimatedNumberResult {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / (duration * 1000), 1);

      // Easing function: ease-out cubic for faster to slower
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      
      const currentValue = easeOutCubic * value;
      setDisplayValue(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setDisplayValue(value);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isInView, value, duration]);

  const formattedValue = decimals > 0 
    ? displayValue.toFixed(decimals)
    : Math.floor(displayValue).toString();

  return {
    displayValue,
    formattedValue,
  };
}

