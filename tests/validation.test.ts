/**
 * @fileoverview Tests for validation utilities
 *
 * These tests verify the validation functions for bounds checking
 * and ensuring layout integrity.
 */

import {
  validateBounds,
  validateDimensions,
  validateSplitPercentage,
} from '../src/utils/validation';
import {
  Bounds,
  Dimensions,
} from '../src/shared/types';

describe('Validation Utilities', () => {
  describe('validateBounds', () => {
    it('should validate correct bounds', () => {
      const bounds: Bounds = {
        x: 10,
        y: 20,
        width: 100,
        height: 50,
      };

      const result = validateBounds(bounds);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject negative width', () => {
      const bounds: Bounds = { x: 0, y: 0, width: -10, height: 50 };
      const result = validateBounds(bounds);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('width must be a non-negative number');
    });

    it('should reject negative height', () => {
      const bounds: Bounds = { x: 0, y: 0, width: 100, height: -50 };
      const result = validateBounds(bounds);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('height must be a non-negative number');
    });

    it('should reject invalid x coordinate', () => {
      const bounds = { x: 'invalid', y: 0, width: 100, height: 50 } as any;
      const result = validateBounds(bounds);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('x must be a number');
    });

    it('should reject invalid y coordinate', () => {
      const bounds = { x: 0, y: 'invalid', width: 100, height: 50 } as any;
      const result = validateBounds(bounds);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('y must be a number');
    });
  });

  describe('validateDimensions', () => {
    it('should validate correct dimensions', () => {
      const dimensions: Dimensions = {
        width: 100,
        height: 50,
      };

      const result = validateDimensions(dimensions);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject negative width', () => {
      const dimensions: Dimensions = { width: -10, height: 50 };
      const result = validateDimensions(dimensions);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('width must be a non-negative number');
    });

    it('should reject negative height', () => {
      const dimensions: Dimensions = { width: 100, height: -50 };
      const result = validateDimensions(dimensions);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('height must be a non-negative number');
    });
  });

  describe('validateSplitPercentage', () => {
    it('should validate correct percentage', () => {
      const result = validateSplitPercentage(50);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject negative percentage', () => {
      const result = validateSplitPercentage(-10);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Split percentage must be between 0 and 100');
    });

    it('should reject percentage over 100', () => {
      const result = validateSplitPercentage(150);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Split percentage must be between 0 and 100');
    });

    it('should reject non-number percentage', () => {
      const result = validateSplitPercentage('invalid' as any);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Split percentage must be a number');
    });
  });
});
