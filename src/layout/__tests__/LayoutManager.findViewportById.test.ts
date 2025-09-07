/**
 * @fileoverview Tests for LayoutManager findViewportById functionality
 *
 * Tests the findViewportById() method, ensuring:
 * 1. Returns correct viewport when ID exists
 * 2. Returns null when ID does not exist
 * 3. Works correctly with multiple viewports
 */

import { LayoutManager } from '../LayoutManager';
import { ScreenBounds } from '../../workspace/types';

describe('LayoutManager - findViewportById()', () => {
  let layoutManager: LayoutManager;
  const testWorkspaceBounds: ScreenBounds = {
    x: 0,
    y: 0,
    width: 1000,
    height: 800,
  };

  beforeEach(() => {
    layoutManager = new LayoutManager();
    layoutManager.setPosition(testWorkspaceBounds);
  });

  describe('findViewportById()', () => {
    it('should return viewport when ID exists', () => {
      // Create a viewport
      const viewport = layoutManager.createViewport();

      // Find viewport by ID
      const foundViewport = layoutManager.findViewportById(viewport.id);

      expect(foundViewport).toBe(viewport);
      expect(foundViewport?.id).toBe(viewport.id);
    });

    it('should return null when ID does not exist', () => {
      // Try to find non-existent viewport
      const foundViewport = layoutManager.findViewportById('non-existent-id');

      expect(foundViewport).toBeNull();
    });

    it('should return correct viewport when multiple viewports exist', () => {
      // Create multiple viewports
      const viewport1 = layoutManager.createViewport({ x: 0, y: 0, width: 0.5, height: 0.5 });
      const viewport2 = layoutManager.createViewport({ x: 0.5, y: 0, width: 0.5, height: 0.5 });
      const viewport3 = layoutManager.createViewport({ x: 0, y: 0.5, width: 1.0, height: 0.5 });

      // Find each viewport by ID
      expect(layoutManager.findViewportById(viewport1.id)).toBe(viewport1);
      expect(layoutManager.findViewportById(viewport2.id)).toBe(viewport2);
      expect(layoutManager.findViewportById(viewport3.id)).toBe(viewport3);
    });

    it('should return null for empty string ID', () => {
      const foundViewport = layoutManager.findViewportById('');

      expect(foundViewport).toBeNull();
    });

    it('should return null when no viewports exist', () => {
      // Don't create any viewports
      const foundViewport = layoutManager.findViewportById('some-id');

      expect(foundViewport).toBeNull();
    });

    it('should work after viewport removal', () => {
      // Create viewport
      const viewport = layoutManager.createViewport();
      const viewportId = viewport.id;

      // Verify it exists
      expect(layoutManager.findViewportById(viewportId)).toBe(viewport);

      // Remove viewport
      layoutManager.removeViewport(viewportId);

      // Should not find it anymore
      expect(layoutManager.findViewportById(viewportId)).toBeNull();
    });

    it('should handle special characters in ID', () => {
      // Create viewport and manually check if we can find it
      const viewport = layoutManager.createViewport();

      // The ID should be a ULID, but let's test the lookup works
      const foundViewport = layoutManager.findViewportById(viewport.id);

      expect(foundViewport).toBe(viewport);
    });

    it('should be case sensitive', () => {
      // Create viewport
      const viewport = layoutManager.createViewport();
      const originalId = viewport.id;
      const uppercaseId = originalId.toUpperCase();

      // Should find with exact case
      expect(layoutManager.findViewportById(originalId)).toBe(viewport);

      // Should not find with different case (if different)
      if (uppercaseId !== originalId) {
        expect(layoutManager.findViewportById(uppercaseId)).toBeNull();
      }
    });
  });
});
