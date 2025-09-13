/**
 * @fileoverview Tests for LayoutManager profile and context management
 *
 * Tests the LayoutManager's ability to:
 * 1. Detect orientation and size changes
 * 2. Automatically create profiles for new contexts
 * 3. Switch between profiles when context changes
 * 4. Preserve layouts when switching contexts
 */

import { LayoutManager } from '../../LayoutManager';
import { ScreenBounds } from '../../../workspace/types';
import { TestIdGenerator } from '../../../shared/TestIdGenerator';

describe('LayoutManager - Profile Management', () => {
  let layoutManager: LayoutManager;

  beforeEach(() => {
    layoutManager = new LayoutManager(new TestIdGenerator('viewport'));
  });

  describe('Context Detection', () => {
    it('should detect landscape orientation', () => {
      const landscapeBounds: ScreenBounds = {
        x: 0,
        y: 0,
        width: 1920,
        height: 1080,
      };

      layoutManager.setScreenBounds(landscapeBounds);

      const context = layoutManager.getCurrentContext();
      expect(context.orientation).toBe('landscape');
      expect(context.aspectRatio).toBeCloseTo(1.78, 2);
    });

    it('should detect portrait orientation', () => {
      const portraitBounds: ScreenBounds = {
        x: 0,
        y: 0,
        width: 800,
        height: 1200,
      };

      layoutManager.setScreenBounds(portraitBounds);

      const context = layoutManager.getCurrentContext();
      expect(context.orientation).toBe('portrait');
      expect(context.aspectRatio).toBeCloseTo(0.67, 2);
    });

    it('should detect size breakpoints', () => {
      const smallBounds: ScreenBounds = {
        x: 0,
        y: 0,
        width: 600,
        height: 400,
      };

      layoutManager.setScreenBounds(smallBounds);

      const context = layoutManager.getCurrentContext();
      expect(context.sizeCategory).toBe('small');
      expect(context.breakpoint).toBe('sm');
    });

    it('should detect ultrawide displays', () => {
      const ultrawideBounds: ScreenBounds = {
        x: 0,
        y: 0,
        width: 3440,
        height: 1440,
      };

      layoutManager.setScreenBounds(ultrawideBounds);

      const context = layoutManager.getCurrentContext();
      expect(context.deviceType).toBe('ultrawide');
      expect(context.aspectRatio).toBeCloseTo(2.39, 2);
    });
  });

  describe('Automatic Profile Creation', () => {
    it('should create initial profile for first context', () => {
      const bounds: ScreenBounds = {
        x: 0,
        y: 0,
        width: 1920,
        height: 1080,
      };

      layoutManager.setScreenBounds(bounds);
      layoutManager.createViewport(); // Create some content

      const profiles = layoutManager.getProfiles();
      expect(profiles.size).toBe(1);

      const contextKey = layoutManager.getCurrentContextKey();
      expect(profiles.has(contextKey)).toBe(true);
    });

    it('should create new profile when context changes', () => {
      // Start in landscape
      const landscapeBounds: ScreenBounds = {
        x: 0,
        y: 0,
        width: 1920,
        height: 1080,
      };
      layoutManager.setScreenBounds(landscapeBounds);
      layoutManager.createViewport();

      // Switch to portrait
      const portraitBounds: ScreenBounds = {
        x: 0,
        y: 0,
        width: 800,
        height: 1200,
      };
      layoutManager.setScreenBounds(portraitBounds);

      const profiles = layoutManager.getProfiles();
      expect(profiles.size).toBe(2);

      const landscapeKey = 'landscape-lg-1920x1080';
      const portraitKey = 'portrait-md-800x1200';
      expect(profiles.has(landscapeKey)).toBe(true);
      expect(profiles.has(portraitKey)).toBe(true);
    });
  });

  describe('Layout Preservation', () => {
    it('should save current layout when switching contexts', () => {
      // Create layout in landscape
      const landscapeBounds: ScreenBounds = {
        x: 0,
        y: 0,
        width: 1920,
        height: 1080,
      };
      layoutManager.setScreenBounds(landscapeBounds);

      const viewport1 = layoutManager.createViewport();

      expect(layoutManager.getViewportCount()).toBe(2);

      // Switch to portrait
      const portraitBounds: ScreenBounds = {
        x: 0,
        y: 0,
        width: 800,
        height: 1200,
      };
      layoutManager.setScreenBounds(portraitBounds);

      // Should have saved landscape layout
      const landscapeProfile = layoutManager.getProfile('landscape-lg-1920x1080');
      expect(landscapeProfile?.viewports).toHaveLength(2);
    });

    it('should restore layout when returning to previous context', () => {
      // Create layout in landscape
      const landscapeBounds: ScreenBounds = {
        x: 0,
        y: 0,
        width: 1920,
        height: 1080,
      };
      layoutManager.setScreenBounds(landscapeBounds);

      const viewport1 = layoutManager.createViewport();
      layoutManager.splitViewport(viewport1, 'right');
      const originalViewportIds = layoutManager.getViewports().map((v) => v.id);

      // Switch to portrait (creates new layout)
      const portraitBounds: ScreenBounds = {
        x: 0,
        y: 0,
        width: 800,
        height: 1200,
      };
      layoutManager.setScreenBounds(portraitBounds);
      expect(layoutManager.getViewportCount()).toBe(1); // Default portrait layout

      // Switch back to landscape
      layoutManager.setScreenBounds(landscapeBounds);

      // Should restore original layout
      expect(layoutManager.getViewportCount()).toBe(2);
      const restoredViewports = layoutManager.getViewports();
      expect(restoredViewports.map((v) => v.id)).toEqual(originalViewportIds);
    });
  });
});
