/**
 * @fileoverview Tests for utility functions
 */

import { isEven, isOdd, clamp, randomBetween } from '../src/lib/utils';

describe('utils', () => {
  describe('isEven', () => {
    it('should return true for even numbers', () => {
      expect(isEven(2)).toBe(true);
      expect(isEven(4)).toBe(true);
      expect(isEven(0)).toBe(true);
      expect(isEven(-2)).toBe(true);
    });

    it('should return false for odd numbers', () => {
      expect(isEven(1)).toBe(false);
      expect(isEven(3)).toBe(false);
      expect(isEven(-1)).toBe(false);
    });
  });

  describe('isOdd', () => {
    it('should return true for odd numbers', () => {
      expect(isOdd(1)).toBe(true);
      expect(isOdd(3)).toBe(true);
      expect(isOdd(-1)).toBe(true);
    });

    it('should return false for even numbers', () => {
      expect(isOdd(2)).toBe(false);
      expect(isOdd(4)).toBe(false);
      expect(isOdd(0)).toBe(false);
      expect(isOdd(-2)).toBe(false);
    });
  });

  describe('clamp', () => {
    it('should return the value if within range', () => {
      expect(clamp(5, 0, 10)).toBe(5);
    });

    it('should return min if value is below range', () => {
      expect(clamp(-5, 0, 10)).toBe(0);
    });

    it('should return max if value is above range', () => {
      expect(clamp(15, 0, 10)).toBe(10);
    });
  });

  describe('randomBetween', () => {
    it('should return a number within the specified range', () => {
      const min = 1;
      const max = 10;
      const result = randomBetween(min, max);
      
      expect(result).toBeGreaterThanOrEqual(min);
      expect(result).toBeLessThanOrEqual(max);
      expect(Number.isInteger(result)).toBe(true);
    });

    it('should return the same number when min equals max', () => {
      const result = randomBetween(5, 5);
      expect(result).toBe(5);
    });
  });
});
