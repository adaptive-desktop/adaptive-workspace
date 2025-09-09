/**
 * @fileoverview Tests for LayoutManager removeViewport functionality
 *
 * Tests the removeViewport() method, ensuring:
 * 1. Viewport is successfully removed from collection
 * 2. Returns true when viewport exists and is removed
 * 3. Returns false when viewport doesn't exist
 * 4. Viewport count is updated correctly
 * 5. Other viewports remain unaffected
 */

import { LayoutManager } from '../../LayoutManager';
import { ScreenBounds } from '../../../workspace/types';
import { TestIdGenerator } from '../../../shared/TestIdGenerator';

describe('LayoutManager - removeViewport()', () => {
  let layoutManager: LayoutManager;
  const testWorkspaceBounds: ScreenBounds = {
    x: 0,
    y: 0,
    width: 1000,
    height: 800,
  };

  beforeEach(() => {
    layoutManager = new LayoutManager(new TestIdGenerator('viewport'));
    layoutManager.setScreenBounds(testWorkspaceBounds);
  });

  describe('removeViewport()', () => {
    it('should remove viewport and return true when viewport exists', () => {
      // Create a viewport
      const viewport = layoutManager.createViewport();

      // Verify it exists
      expect(layoutManager.getViewports()).toHaveLength(1);
      expect(layoutManager.hasViewport(viewport.id)).toBe(true);
      expect(layoutManager.getViewportCount()).toBe(1);

      // Remove viewport
      const result = layoutManager.removeViewport(viewport);

      // Should return true and remove viewport
      expect(result).toBe(true);
      expect(layoutManager.getViewports()).toHaveLength(0);
      expect(layoutManager.hasViewport(viewport.id)).toBe(false);
      expect(layoutManager.getViewportCount()).toBe(0);
    });

    it('should return false when trying to remove non-existent viewport', () => {
      // Create a viewport but don't add it to the layout manager
      const fakeViewport = {
        id: 'fake-viewport-id',
        screenBounds: { x: 0, y: 0, width: 500, height: 400 },
      };

      // Try to remove non-existent viewport
      const result = layoutManager.removeViewport(fakeViewport);

      // Should return false
      expect(result).toBe(false);
      expect(layoutManager.getViewports()).toHaveLength(0);
      expect(layoutManager.getViewportCount()).toBe(0);
    });

    it('should remove correct viewport when multiple viewports exist', () => {
      // Create multiple viewports
      const viewport1 = layoutManager.createViewport({ x: 0, y: 0, width: 0.5, height: 0.5 });
      const viewport2 = layoutManager.createViewport({ x: 0.5, y: 0, width: 0.5, height: 0.5 });
      const viewport3 = layoutManager.createViewport({ x: 0, y: 0.5, width: 1.0, height: 0.5 });

      // Verify all exist
      expect(layoutManager.getViewports()).toHaveLength(3);
      expect(layoutManager.getViewportCount()).toBe(3);

      // Remove middle viewport
      const result = layoutManager.removeViewport(viewport2);

      // Should remove only viewport2
      expect(result).toBe(true);
      expect(layoutManager.getViewports()).toHaveLength(2);
      expect(layoutManager.getViewportCount()).toBe(2);

      // Verify correct viewports remain
      const remainingViewports = layoutManager.getViewports();
      expect(remainingViewports).toContain(viewport1);
      expect(remainingViewports).toContain(viewport3);
      expect(remainingViewports).not.toContain(viewport2);

      // Verify hasViewport works correctly
      expect(layoutManager.hasViewport(viewport1.id)).toBe(true);
      expect(layoutManager.hasViewport(viewport2.id)).toBe(false);
      expect(layoutManager.hasViewport(viewport3.id)).toBe(true);
    });

    it('should handle removing the same viewport twice', () => {
      // Create a viewport
      const viewport = layoutManager.createViewport();

      // Remove it once
      const firstResult = layoutManager.removeViewport(viewport);
      expect(firstResult).toBe(true);
      expect(layoutManager.getViewports()).toHaveLength(0);

      // Try to remove it again
      const secondResult = layoutManager.removeViewport(viewport);
      expect(secondResult).toBe(false);
      expect(layoutManager.getViewports()).toHaveLength(0);
    });

    it('should work correctly after removing all viewports', () => {
      // Create multiple viewports
      const viewport1 = layoutManager.createViewport({ x: 0, y: 0, width: 0.5, height: 1.0 });
      const viewport2 = layoutManager.createViewport({ x: 0.5, y: 0, width: 0.5, height: 1.0 });

      expect(layoutManager.getViewports()).toHaveLength(2);

      // Remove all viewports
      layoutManager.removeViewport(viewport1);
      layoutManager.removeViewport(viewport2);

      // Should be empty
      expect(layoutManager.getViewports()).toHaveLength(0);
      expect(layoutManager.getViewportCount()).toBe(0);

      // Should be able to create new viewport after removing all
      const newViewport = layoutManager.createViewport();
      expect(layoutManager.getViewports()).toHaveLength(1);
      expect(layoutManager.getViewports()[0]).toBe(newViewport);
    });

    it('should not affect findViewportById after removal', () => {
      // Create viewport
      const viewport = layoutManager.createViewport();
      const viewportId = viewport.id;

      // Verify it can be found
      expect(layoutManager.findViewportById(viewportId)).toBe(viewport);

      // Remove viewport
      layoutManager.removeViewport(viewport);

      // Should not be found anymore
      expect(layoutManager.findViewportById(viewportId)).toBeNull();
    });

    it('should handle viewport with special characters in ID', () => {
      // Create viewport (ID will be generated automatically)
      const viewport = layoutManager.createViewport();

      // Remove it
      const result = layoutManager.removeViewport(viewport);

      expect(result).toBe(true);
      expect(layoutManager.getViewports()).toHaveLength(0);
    });
  });
});
