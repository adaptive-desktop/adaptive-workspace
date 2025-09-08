/**
 * @fileoverview Tests for LayoutManager splitViewport functionality
 *
 * Tests the splitViewport() method, ensuring:
 * 1. Returned viewport has correct values
 * 2. getViewports() returns both the original and newly created viewport
 * 3. Both viewports have correct ProportionalBounds after split
 */

import { LayoutManager } from '../../LayoutManager';
import { MutableViewport } from '../../../viewport/MutableViewport';
import { ScreenBounds } from '../../../workspace/types';

describe('LayoutManager - splitViewport()', () => {
  let layoutManager: LayoutManager;
  const testWorkspaceBounds: ScreenBounds = {
    x: 0,
    y: 0,
    width: 1000,
    height: 800,
  };

  beforeEach(() => {
    layoutManager = new LayoutManager();
    layoutManager.setScreenBounds(testWorkspaceBounds);
  });

  describe('splitViewport() down direction', () => {
    it('should create new viewport below original viewport', () => {
      // Create initial viewport (full workspace)
      const originalViewport = layoutManager.createViewport();

      // Split down - new viewport should be below
      const newViewport = layoutManager.splitViewport(originalViewport, 'down');

      // Check returned viewport has correct values
      expect(newViewport.id).toBeDefined();
      expect(typeof newViewport.id).toBe('string');
      expect(newViewport.id.length).toBeGreaterThan(0);
      expect(newViewport.id).not.toBe(originalViewport.id);

      // Check new viewport screen bounds (bottom half)
      expect(newViewport.screenBounds).toEqual({
        x: 0,
        y: 400, // 50% of 800 = 400
        width: 1000,
        height: 400, // 50% of 800 = 400
      });
    });

    it('should update original viewport bounds to top half', () => {
      // Create initial viewport (full workspace)
      const originalViewport = layoutManager.createViewport();

      // Split down
      layoutManager.splitViewport(originalViewport, 'down');

      // Check original viewport screen bounds (top half)
      expect(originalViewport.screenBounds).toEqual({
        x: 0,
        y: 0,
        width: 1000,
        height: 400, // 50% of 800 = 400
      });
    });

    it('should add both viewports to getViewports() result', () => {
      // Create initial viewport
      const originalViewport = layoutManager.createViewport();

      // Split down
      const newViewport = layoutManager.splitViewport(originalViewport, 'down');

      const allViewports = layoutManager.getViewports();

      expect(allViewports).toHaveLength(2);
      expect(allViewports).toContain(originalViewport);
      expect(allViewports).toContain(newViewport);
    });

    it('should have correct proportional bounds for both viewports', () => {
      // Create initial viewport
      const originalViewport = layoutManager.createViewport();

      // Split down
      const newViewport = layoutManager.splitViewport(originalViewport, 'down');

      // Check original viewport proportional bounds (top half)
      const originalMutable = originalViewport as MutableViewport;
      expect(originalMutable.proportionalBounds).toEqual({
        x: 0,
        y: 0,
        width: 1.0,
        height: 0.5,
      });

      // Check new viewport proportional bounds (bottom half)
      const newMutable = newViewport as MutableViewport;
      expect(newMutable.proportionalBounds).toEqual({
        x: 0,
        y: 0.5,
        width: 1.0,
        height: 0.5,
      });
    });

    it('should update viewport count correctly', () => {
      expect(layoutManager.getViewportCount()).toBe(0);

      // Create initial viewport
      const originalViewport = layoutManager.createViewport();
      expect(layoutManager.getViewportCount()).toBe(1);

      // Split viewport
      layoutManager.splitViewport(originalViewport, 'down');
      expect(layoutManager.getViewportCount()).toBe(2);
    });

    it('should work with workspace bounds updates', () => {
      // Create and split viewport
      const originalViewport = layoutManager.createViewport();
      const newViewport = layoutManager.splitViewport(originalViewport, 'down');

      // Change workspace bounds
      const newWorkspaceBounds: ScreenBounds = {
        x: 100,
        y: 50,
        width: 1200,
        height: 900,
      };
      layoutManager.setScreenBounds(newWorkspaceBounds);

      // Check original viewport screen bounds recalculate (top half)
      expect(originalViewport.screenBounds).toEqual({
        x: 100,
        y: 50,
        width: 1200,
        height: 450, // 50% of 900 = 450
      });

      // Check new viewport screen bounds recalculate (bottom half)
      expect(newViewport.screenBounds).toEqual({
        x: 100,
        y: 500, // 50 + (50% of 900) = 50 + 450 = 500
        width: 1200,
        height: 450, // 50% of 900 = 450
      });
    });
  });

  describe('splitViewport() up direction', () => {
    it('should create new viewport above original viewport', () => {
      // Create initial viewport (full workspace)
      const originalViewport = layoutManager.createViewport();

      // Split up - new viewport should be above
      const newViewport = layoutManager.splitViewport(originalViewport, 'up');

      // Check new viewport screen bounds (top half)
      expect(newViewport.screenBounds).toEqual({
        x: 0,
        y: 0,
        width: 1000,
        height: 400, // 50% of 800 = 400
      });
    });

    it('should update original viewport bounds to bottom half', () => {
      // Create initial viewport (full workspace)
      const originalViewport = layoutManager.createViewport();

      // Split up
      layoutManager.splitViewport(originalViewport, 'up');

      // Check original viewport screen bounds (bottom half)
      expect(originalViewport.screenBounds).toEqual({
        x: 0,
        y: 400, // 50% of 800 = 400
        width: 1000,
        height: 400, // 50% of 800 = 400
      });
    });

    it('should have correct proportional bounds for both viewports', () => {
      // Create initial viewport
      const originalViewport = layoutManager.createViewport();

      // Split up
      const newViewport = layoutManager.splitViewport(originalViewport, 'up');

      // Check original viewport proportional bounds (bottom half)
      const originalMutable = originalViewport as MutableViewport;
      expect(originalMutable.proportionalBounds).toEqual({
        x: 0,
        y: 0.5,
        width: 1.0,
        height: 0.5,
      });

      // Check new viewport proportional bounds (top half)
      const newMutable = newViewport as MutableViewport;
      expect(newMutable.proportionalBounds).toEqual({
        x: 0,
        y: 0,
        width: 1.0,
        height: 0.5,
      });
    });
  });

  describe('splitViewport() right direction', () => {
    it('should create new viewport to the right of original viewport', () => {
      // Create initial viewport (full workspace)
      const originalViewport = layoutManager.createViewport();

      // Split right - new viewport should be on the right
      const newViewport = layoutManager.splitViewport(originalViewport, 'right');

      // Check new viewport screen bounds (right half)
      expect(newViewport.screenBounds).toEqual({
        x: 500, // 50% of 1000 = 500
        y: 0,
        width: 500, // 50% of 1000 = 500
        height: 800,
      });
    });

    it('should update original viewport bounds to left half', () => {
      // Create initial viewport (full workspace)
      const originalViewport = layoutManager.createViewport();

      // Split right
      layoutManager.splitViewport(originalViewport, 'right');

      // Check original viewport screen bounds (left half)
      expect(originalViewport.screenBounds).toEqual({
        x: 0,
        y: 0,
        width: 500, // 50% of 1000 = 500
        height: 800,
      });
    });

    it('should have correct proportional bounds for both viewports', () => {
      // Create initial viewport
      const originalViewport = layoutManager.createViewport();

      // Split right
      const newViewport = layoutManager.splitViewport(originalViewport, 'right');

      // Check original viewport proportional bounds (left half)
      const originalMutable = originalViewport as MutableViewport;
      expect(originalMutable.proportionalBounds).toEqual({
        x: 0,
        y: 0,
        width: 0.5,
        height: 1.0,
      });

      // Check new viewport proportional bounds (right half)
      const newMutable = newViewport as MutableViewport;
      expect(newMutable.proportionalBounds).toEqual({
        x: 0.5,
        y: 0,
        width: 0.5,
        height: 1.0,
      });
    });
  });

  describe('splitViewport() left direction', () => {
    it('should create new viewport to the left of original viewport', () => {
      // Create initial viewport (full workspace)
      const originalViewport = layoutManager.createViewport();

      // Split left - new viewport should be on the left
      const newViewport = layoutManager.splitViewport(originalViewport, 'left');

      // Check new viewport screen bounds (left half)
      expect(newViewport.screenBounds).toEqual({
        x: 0,
        y: 0,
        width: 500, // 50% of 1000 = 500
        height: 800,
      });
    });

    it('should update original viewport bounds to right half', () => {
      // Create initial viewport (full workspace)
      const originalViewport = layoutManager.createViewport();

      // Split left
      layoutManager.splitViewport(originalViewport, 'left');

      // Check original viewport screen bounds (right half)
      expect(originalViewport.screenBounds).toEqual({
        x: 500, // 50% of 1000 = 500
        y: 0,
        width: 500, // 50% of 1000 = 500
        height: 800,
      });
    });

    it('should have correct proportional bounds for both viewports', () => {
      // Create initial viewport
      const originalViewport = layoutManager.createViewport();

      // Split left
      const newViewport = layoutManager.splitViewport(originalViewport, 'left');

      // Check original viewport proportional bounds (right half)
      const originalMutable = originalViewport as MutableViewport;
      expect(originalMutable.proportionalBounds).toEqual({
        x: 0.5,
        y: 0,
        width: 0.5,
        height: 1.0,
      });

      // Check new viewport proportional bounds (left half)
      const newMutable = newViewport as MutableViewport;
      expect(newMutable.proportionalBounds).toEqual({
        x: 0,
        y: 0,
        width: 0.5,
        height: 1.0,
      });
    });
  });
});
