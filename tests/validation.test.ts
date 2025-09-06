/**
 * @fileoverview Tests for validation utilities
 *
 * These tests verify the validation functions for layout constraints,
 * bounds checking, and ensuring layout integrity.
 */

import {
  validateChildConstraints,
  validateRegionConstraints,
  validateBounds,
  validateDimensions,
  validateLayoutDirection,
  validateLayoutPath,
  validatePanelId,
  validateResize,
  validateDimensionsAgainstConstraints,
  validateSplitPercentage,
  validateLayoutConfiguration,
} from '../src/utils/validation';
import {
  ChildConstraints,
  RegionConstraints,
  Bounds,
  Dimensions,
  LayoutDirection,
  LayoutPath,
} from '../src/shared/types';

describe('Validation Utilities', () => {
  describe('validateChildConstraints', () => {
    it('should validate correct child constraints', () => {
      const constraints: ChildConstraints = {
        minSize: 100,
        maxSize: 500,
        priority: 1,
        locked: false,
        collapsible: true,
      };

      const result = validateChildConstraints(constraints);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject negative minSize', () => {
      const constraints: ChildConstraints = { minSize: -10 };
      const result = validateChildConstraints(constraints);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('minSize must be a non-negative number');
    });

    it('should reject maxSize less than minSize', () => {
      const constraints: ChildConstraints = { minSize: 100, maxSize: 50 };
      const result = validateChildConstraints(constraints);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('maxSize must be greater than or equal to minSize');
    });

    it('should reject invalid types', () => {
      const constraints = {
        minSize: 'invalid',
        priority: 'not-a-number',
        locked: 'not-boolean',
        collapsible: 123,
      } as any;

      const result = validateChildConstraints(constraints);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('minSize must be a non-negative number');
      expect(result.errors).toContain('priority must be a number');
      expect(result.errors).toContain('locked must be a boolean');
      expect(result.errors).toContain('collapsible must be a boolean');
    });
  });

  describe('validateRegionConstraints', () => {
    it('should validate correct region constraints', () => {
      const constraints: RegionConstraints = {
        leading: { minSize: 100, locked: false },
        trailing: { maxSize: 500, collapsible: true },
      };

      const result = validateRegionConstraints(constraints);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should propagate child constraint errors', () => {
      const constraints: RegionConstraints = {
        leading: { minSize: -10 },
        trailing: { minSize: 100, maxSize: 50 },
      };

      const result = validateRegionConstraints(constraints);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('leading: minSize must be a non-negative number');
      expect(result.errors).toContain('trailing: maxSize must be greater than or equal to minSize');
    });
  });

  describe('validateBounds', () => {
    it('should validate correct bounds', () => {
      const bounds: Bounds = { x: 10, y: 20, width: 100, height: 50 };
      const result = validateBounds(bounds);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid bounds', () => {
      const bounds = {
        x: 'invalid',
        y: Infinity,
        width: 0,
        height: -10,
      } as any;

      const result = validateBounds(bounds);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('x must be a finite number');
      expect(result.errors).toContain('y must be a finite number');
      expect(result.errors).toContain('width must be a positive finite number');
      expect(result.errors).toContain('height must be a positive finite number');
    });
  });

  describe('validateDimensions', () => {
    it('should validate correct dimensions', () => {
      const dimensions: Dimensions = { width: 100, height: 50 };
      const result = validateDimensions(dimensions);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject invalid dimensions', () => {
      const dimensions = {
        width: 0,
        height: -10,
      } as any;

      const result = validateDimensions(dimensions);
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('width must be a positive finite number');
      expect(result.errors).toContain('height must be a positive finite number');
    });
  });

  describe('validateLayoutDirection', () => {
    it('should validate correct directions', () => {
      expect(validateLayoutDirection('row')).toBe(true);
      expect(validateLayoutDirection('column')).toBe(true);
    });

    it('should reject invalid directions', () => {
      expect(validateLayoutDirection('invalid')).toBe(false);
      expect(validateLayoutDirection(123)).toBe(false);
      expect(validateLayoutDirection(null)).toBe(false);
    });
  });

  describe('validateLayoutPath', () => {
    it('should validate correct paths', () => {
      expect(validateLayoutPath([])).toBe(true);
      expect(validateLayoutPath(['leading'])).toBe(true);
      expect(validateLayoutPath(['leading', 'trailing'])).toBe(true);
    });

    it('should reject invalid paths', () => {
      expect(validateLayoutPath('not-array')).toBe(false);
      expect(validateLayoutPath(['invalid'])).toBe(false);
      expect(validateLayoutPath(['leading', 'invalid'])).toBe(false);
    });
  });

  describe('validatePanelId', () => {
    it('should validate correct panel IDs', () => {
      expect(validatePanelId('panel1')).toBe(true);
      expect(validatePanelId(123)).toBe(true);
      expect(validatePanelId('')).toBe(true); // empty string is valid
      expect(validatePanelId(0)).toBe(true); // zero is valid
    });

    it('should reject invalid panel IDs', () => {
      expect(validatePanelId(null)).toBe(false);
      expect(validatePanelId(undefined)).toBe(false);
      expect(validatePanelId({})).toBe(false);
      expect(validatePanelId([])).toBe(false);
    });
  });

  describe('validateResize', () => {
    it('should allow resize with no constraints', () => {
      const result = validateResize(undefined, 100, 60, 200);
      expect(result.valid).toBe(true);
    });

    it('should reject resize when leading is locked', () => {
      const constraints: RegionConstraints = {
        leading: { locked: true },
      };

      const result = validateResize(constraints, 100, 60, 200);
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Leading region is locked');
    });

    it('should reject resize when trailing is locked', () => {
      const constraints: RegionConstraints = {
        trailing: { locked: true },
      };

      const result = validateResize(constraints, 100, 60, 200);
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Trailing region is locked');
    });

    it('should reject resize violating minSize constraints', () => {
      const constraints: RegionConstraints = {
        leading: { minSize: 150 },
      };

      const result = validateResize(constraints, 100, 60, 200); // leading would be 120
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Leading region would be smaller than minimum size');
    });

    it('should reject resize violating maxSize constraints', () => {
      const constraints: RegionConstraints = {
        trailing: { maxSize: 50 },
      };

      const result = validateResize(constraints, 100, 60, 200); // trailing would be 80
      expect(result.valid).toBe(false);
      expect(result.reason).toBe('Trailing region would be larger than maximum size');
    });
  });

  describe('validateDimensionsAgainstConstraints', () => {
    it('should validate dimensions meeting constraints', () => {
      const dimensions: Dimensions = { width: 200, height: 150 };
      const constraints: ChildConstraints = { minSize: 100, maxSize: 300 };

      const result = validateDimensionsAgainstConstraints(dimensions, constraints);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject dimensions below minimum', () => {
      const dimensions: Dimensions = { width: 50, height: 80 };
      const constraints: ChildConstraints = { minSize: 100 };

      const result = validateDimensionsAgainstConstraints(dimensions, constraints);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Minimum dimension 50 is less than required 100');
    });

    it('should reject dimensions above maximum', () => {
      const dimensions: Dimensions = { width: 400, height: 300 };
      const constraints: ChildConstraints = { maxSize: 200 };

      const result = validateDimensionsAgainstConstraints(dimensions, constraints);
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Maximum dimension 400 exceeds limit 200');
    });
  });

  describe('validateSplitPercentage', () => {
    it('should validate correct percentages', () => {
      expect(validateSplitPercentage(50).valid).toBe(true);
      expect(validateSplitPercentage(0).valid).toBe(true);
      expect(validateSplitPercentage(100).valid).toBe(true);
    });

    it('should reject invalid percentages', () => {
      expect(validateSplitPercentage(-10).valid).toBe(false);
      expect(validateSplitPercentage(110).valid).toBe(false);
      expect(validateSplitPercentage(NaN).valid).toBe(false);
      expect(validateSplitPercentage(Infinity).valid).toBe(false);
    });
  });

  describe('validateLayoutConfiguration', () => {
    it('should validate correct configuration', () => {
      const config = {
        bounds: { x: 0, y: 0, width: 100, height: 50 },
        direction: 'row' as LayoutDirection,
        splitPercentage: 60,
        constraints: {
          leading: { minSize: 20 },
          trailing: { maxSize: 80 },
        },
      };

      const result = validateLayoutConfiguration(config);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should collect all validation errors', () => {
      const config = {
        bounds: { x: 0, y: 0, width: 0, height: -10 },
        direction: 'invalid' as any,
        splitPercentage: 150,
        constraints: {
          leading: { minSize: -10 },
        },
      };

      const result = validateLayoutConfiguration(config);
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some((e) => e.includes('width'))).toBe(true);
      expect(result.errors.some((e) => e.includes('height'))).toBe(true);
      expect(result.errors.some((e) => e.includes('direction'))).toBe(true);
      expect(result.errors.some((e) => e.includes('percentage'))).toBe(true);
      expect(result.errors.some((e) => e.includes('minSize'))).toBe(true);
    });
  });
});
