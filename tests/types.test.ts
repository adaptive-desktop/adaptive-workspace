/**
 * @fileoverview Tests for core type definitions
 *
 * These tests verify that the type system works correctly and provides
 * proper type safety and inference.
 */

import {
  Dimensions,
  Bounds,
} from '../src/shared/types';

describe('Core Types', () => {
  describe('Dimensions', () => {
    it('should have width and height properties', () => {
      const dimensions: Dimensions = {
        width: 100,
        height: 200,
      };

      expect(dimensions.width).toBe(100);
      expect(dimensions.height).toBe(200);
    });

    it('should accept zero dimensions', () => {
      const dimensions: Dimensions = {
        width: 0,
        height: 0,
      };

      expect(dimensions.width).toBe(0);
      expect(dimensions.height).toBe(0);
    });

    it('should accept fractional dimensions', () => {
      const dimensions: Dimensions = {
        width: 100.5,
        height: 200.75,
      };

      expect(dimensions.width).toBe(100.5);
      expect(dimensions.height).toBe(200.75);
    });
  });

  describe('Bounds', () => {
    it('should have position and size properties', () => {
      const bounds: Bounds = {
        x: 10,
        y: 20,
        width: 100,
        height: 200,
      };

      expect(bounds.x).toBe(10);
      expect(bounds.y).toBe(20);
      expect(bounds.width).toBe(100);
      expect(bounds.height).toBe(200);
    });

    it('should accept zero position and size', () => {
      const bounds: Bounds = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
      };

      expect(bounds.x).toBe(0);
      expect(bounds.y).toBe(0);
      expect(bounds.width).toBe(0);
      expect(bounds.height).toBe(0);
    });

    it('should accept negative positions', () => {
      const bounds: Bounds = {
        x: -10,
        y: -20,
        width: 100,
        height: 200,
      };

      expect(bounds.x).toBe(-10);
      expect(bounds.y).toBe(-20);
      expect(bounds.width).toBe(100);
      expect(bounds.height).toBe(200);
    });

    it('should accept fractional values', () => {
      const bounds: Bounds = {
        x: 10.5,
        y: 20.75,
        width: 100.25,
        height: 200.5,
      };

      expect(bounds.x).toBe(10.5);
      expect(bounds.y).toBe(20.75);
      expect(bounds.width).toBe(100.25);
      expect(bounds.height).toBe(200.5);
    });

  });
});
