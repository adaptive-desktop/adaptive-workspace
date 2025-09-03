/**
 * @fileoverview Example utility functions
 *
 * This file contains example utility functions.
 * Replace this with your actual utility functions.
 */

/**
 * Check if a number is even
 * @param num Number to check
 * @returns True if the number is even, false otherwise
 */
export function isEven(num: number): boolean {
  return num % 2 === 0;
}

/**
 * Check if a number is odd
 * @param num Number to check
 * @returns True if the number is odd, false otherwise
 */
export function isOdd(num: number): boolean {
  return num % 2 !== 0;
}

/**
 * Clamp a number between min and max values
 * @param value Value to clamp
 * @param min Minimum value
 * @param max Maximum value
 * @returns Clamped value
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * Generate a random number between min and max (inclusive)
 * @param min Minimum value
 * @param max Maximum value
 * @returns Random number between min and max
 */
export function randomBetween(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
