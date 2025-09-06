/**
 * @fileoverview Tests for bounds utilities
 *
 * These tests verify the utility functions for working with bounds,
 * dimensions, and workspace areas in the layout system.
 */

import {
  calculateArea,
  isPointInBounds,
  boundsIntersect,
  getBoundsIntersection,
  getBoundsUnion,
  scaleBounds,
  translateBounds,
  boundsToDimensions,
  createBounds,
  applySafeArea,
  meetsMinimumSize,
  clampDimensions,
  createRegionBounds,
  isValidBounds,
  normalizeBounds,
} from '../src/utils/boundsUtils';
import { Bounds, Dimensions, WorkspaceBounds, LayoutPath } from '../src/shared/types';

describe('Bounds Utilities', () => {
  const testBounds: Bounds = { x: 10, y: 20, width: 100, height: 50 };
  const testDimensions: Dimensions = { width: 100, height: 50 };

  describe('calculateArea', () => {
    it('should calculate area correctly', () => {
      expect(calculateArea(testBounds)).toBe(5000);
    });

    it('should handle zero dimensions', () => {
      expect(calculateArea({ x: 0, y: 0, width: 0, height: 10 })).toBe(0);
      expect(calculateArea({ x: 0, y: 0, width: 10, height: 0 })).toBe(0);
    });
  });

  describe('isPointInBounds', () => {
    it('should return true for points inside bounds', () => {
      expect(isPointInBounds(50, 40, testBounds)).toBe(true);
      expect(isPointInBounds(10, 20, testBounds)).toBe(true); // top-left corner
      expect(isPointInBounds(110, 70, testBounds)).toBe(true); // bottom-right corner
    });

    it('should return false for points outside bounds', () => {
      expect(isPointInBounds(5, 40, testBounds)).toBe(false); // left of bounds
      expect(isPointInBounds(50, 15, testBounds)).toBe(false); // above bounds
      expect(isPointInBounds(115, 40, testBounds)).toBe(false); // right of bounds
      expect(isPointInBounds(50, 75, testBounds)).toBe(false); // below bounds
    });
  });

  describe('boundsIntersect', () => {
    it('should return true for intersecting bounds', () => {
      const bounds1 = { x: 0, y: 0, width: 50, height: 50 };
      const bounds2 = { x: 25, y: 25, width: 50, height: 50 };
      expect(boundsIntersect(bounds1, bounds2)).toBe(true);
    });

    it('should return false for non-intersecting bounds', () => {
      const bounds1 = { x: 0, y: 0, width: 50, height: 50 };
      const bounds2 = { x: 60, y: 60, width: 50, height: 50 };
      expect(boundsIntersect(bounds1, bounds2)).toBe(false);
    });

    it('should return true for touching bounds', () => {
      const bounds1 = { x: 0, y: 0, width: 50, height: 50 };
      const bounds2 = { x: 50, y: 0, width: 50, height: 50 };
      expect(boundsIntersect(bounds1, bounds2)).toBe(true);
    });
  });

  describe('getBoundsIntersection', () => {
    it('should return intersection for overlapping bounds', () => {
      const bounds1 = { x: 0, y: 0, width: 50, height: 50 };
      const bounds2 = { x: 25, y: 25, width: 50, height: 50 };
      const intersection = getBoundsIntersection(bounds1, bounds2);

      expect(intersection).toEqual({ x: 25, y: 25, width: 25, height: 25 });
    });

    it('should return null for non-intersecting bounds', () => {
      const bounds1 = { x: 0, y: 0, width: 50, height: 50 };
      const bounds2 = { x: 60, y: 60, width: 50, height: 50 };

      expect(getBoundsIntersection(bounds1, bounds2)).toBeNull();
    });
  });

  describe('getBoundsUnion', () => {
    it('should return union of two bounds', () => {
      const bounds1 = { x: 0, y: 0, width: 50, height: 50 };
      const bounds2 = { x: 25, y: 25, width: 50, height: 50 };
      const union = getBoundsUnion(bounds1, bounds2);

      expect(union).toEqual({ x: 0, y: 0, width: 75, height: 75 });
    });

    it('should handle non-overlapping bounds', () => {
      const bounds1 = { x: 0, y: 0, width: 50, height: 50 };
      const bounds2 = { x: 100, y: 100, width: 50, height: 50 };
      const union = getBoundsUnion(bounds1, bounds2);

      expect(union).toEqual({ x: 0, y: 0, width: 150, height: 150 });
    });
  });

  describe('scaleBounds', () => {
    it('should scale bounds by factor', () => {
      const scaled = scaleBounds(testBounds, 2);
      expect(scaled).toEqual({ x: 20, y: 40, width: 200, height: 100 });
    });

    it('should handle fractional scaling', () => {
      const scaled = scaleBounds(testBounds, 0.5);
      expect(scaled).toEqual({ x: 5, y: 10, width: 50, height: 25 });
    });
  });

  describe('translateBounds', () => {
    it('should translate bounds by offset', () => {
      const translated = translateBounds(testBounds, 5, -10);
      expect(translated).toEqual({ x: 15, y: 10, width: 100, height: 50 });
    });

    it('should handle zero offset', () => {
      const translated = translateBounds(testBounds, 0, 0);
      expect(translated).toEqual(testBounds);
    });
  });

  describe('boundsToDimensions', () => {
    it('should extract dimensions from bounds', () => {
      const dimensions = boundsToDimensions(testBounds);
      expect(dimensions).toEqual({ width: 100, height: 50 });
    });
  });

  describe('createBounds', () => {
    it('should create bounds from position and dimensions', () => {
      const bounds = createBounds(10, 20, testDimensions);
      expect(bounds).toEqual({ x: 10, y: 20, width: 100, height: 50 });
    });
  });

  describe('applySafeArea', () => {
    const workspace: WorkspaceBounds = {
      x: 0,
      y: 0,
      width: 1000,
      height: 800,
      safeArea: {
        top: 20,
        bottom: 30,
        left: 10,
        right: 15,
      },
    };

    it('should apply safe area constraints', () => {
      const safeBounds = applySafeArea(workspace);
      expect(safeBounds).toEqual({
        x: 10,
        y: 20,
        width: 975, // 1000 - 10 - 15
        height: 750, // 800 - 20 - 30
      });
    });

    it('should return original bounds when no safe area', () => {
      const workspaceNoSafe: WorkspaceBounds = {
        x: 0,
        y: 0,
        width: 1000,
        height: 800,
      };

      const safeBounds = applySafeArea(workspaceNoSafe);
      expect(safeBounds).toEqual({
        x: 0,
        y: 0,
        width: 1000,
        height: 800,
      });
    });
  });

  describe('meetsMinimumSize', () => {
    it('should return true when dimensions meet minimum', () => {
      expect(meetsMinimumSize(testDimensions, 50, 25)).toBe(true);
      expect(meetsMinimumSize(testDimensions, 100, 50)).toBe(true);
    });

    it('should return false when dimensions do not meet minimum', () => {
      expect(meetsMinimumSize(testDimensions, 150, 25)).toBe(false);
      expect(meetsMinimumSize(testDimensions, 50, 75)).toBe(false);
    });
  });

  describe('clampDimensions', () => {
    it('should clamp to minimum values', () => {
      const small = { width: 10, height: 5 };
      const clamped = clampDimensions(small, 50, 25);
      expect(clamped).toEqual({ width: 50, height: 25 });
    });

    it('should clamp to maximum values', () => {
      const large = { width: 200, height: 150 };
      const clamped = clampDimensions(large, 50, 25, 100, 75);
      expect(clamped).toEqual({ width: 100, height: 75 });
    });

    it('should not change dimensions within range', () => {
      const clamped = clampDimensions(testDimensions, 50, 25, 150, 75);
      expect(clamped).toEqual(testDimensions);
    });
  });

  describe('createRegionBounds', () => {
    it('should create region bounds with path', () => {
      const path: LayoutPath = ['leading', 'trailing'];
      const regionBounds = createRegionBounds(path, testBounds);

      expect(regionBounds).toEqual({
        ...testBounds,
        path,
      });
    });
  });

  describe('isValidBounds', () => {
    it('should return true for valid bounds', () => {
      expect(isValidBounds(testBounds)).toBe(true);
    });

    it('should return false for invalid bounds', () => {
      expect(isValidBounds({ x: 0, y: 0, width: 0, height: 50 })).toBe(false);
      expect(isValidBounds({ x: 0, y: 0, width: 50, height: 0 })).toBe(false);
      expect(isValidBounds({ x: 0, y: 0, width: -10, height: 50 })).toBe(false);
    });
  });

  describe('normalizeBounds', () => {
    it('should normalize bounds with negative dimensions', () => {
      const negativeBounds = { x: 50, y: 60, width: -30, height: -20 };
      const normalized = normalizeBounds(negativeBounds);

      expect(normalized).toEqual({
        x: 20, // 50 + (-30)
        y: 40, // 60 + (-20)
        width: 30,
        height: 20,
      });
    });

    it('should not change positive bounds', () => {
      const normalized = normalizeBounds(testBounds);
      expect(normalized).toEqual(testBounds);
    });
  });
});
