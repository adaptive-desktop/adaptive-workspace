/**
 * @fileoverview Tests for LayoutManager getCurrentContext functionality
 *
 * Tests the getCurrentContext() method's ability to:
 * 1. Detect orientation from screen bounds
 * 2. Calculate aspect ratios correctly
 * 3. Categorize device types
 * 4. Determine size breakpoints
 */

import { LayoutManager } from '../LayoutManager';
import { ScreenBounds } from '../../workspace/types';
import { TestIdGenerator } from '../../shared/TestIdGenerator';

describe('LayoutManager - getCurrentContext()', () => {
  let layoutManager: LayoutManager;

  beforeEach(() => {
    layoutManager = new LayoutManager(new TestIdGenerator('viewport'));
  });

  describe('Orientation Detection', () => {
    it('should detect landscape when width > height', () => {
      const bounds: ScreenBounds = {
        x: 0,
        y: 0,
        width: 1920,
        height: 1080,
      };

      layoutManager.setScreenBounds(bounds);
      const context = layoutManager.getCurrentContext();

      expect(context.orientation).toBe('landscape');
    });

    it('should detect portrait when height > width', () => {
      const bounds: ScreenBounds = {
        x: 0,
        y: 0,
        width: 800,
        height: 1200,
      };

      layoutManager.setScreenBounds(bounds);
      const context = layoutManager.getCurrentContext();

      expect(context.orientation).toBe('portrait');
    });

    it('should detect landscape when width equals height (square)', () => {
      const bounds: ScreenBounds = {
        x: 0,
        y: 0,
        width: 1000,
        height: 1000,
      };

      layoutManager.setScreenBounds(bounds);
      const context = layoutManager.getCurrentContext();

      expect(context.orientation).toBe('landscape');
    });
  });

  describe('Aspect Ratio Calculation', () => {
    it('should calculate correct aspect ratio for 16:9 display', () => {
      const bounds: ScreenBounds = {
        x: 0,
        y: 0,
        width: 1920,
        height: 1080,
      };

      layoutManager.setScreenBounds(bounds);
      const context = layoutManager.getCurrentContext();

      expect(context.aspectRatio).toBeCloseTo(1.78, 2);
    });

    it('should calculate correct aspect ratio for 4:3 display', () => {
      const bounds: ScreenBounds = {
        x: 0,
        y: 0,
        width: 1024,
        height: 768,
      };

      layoutManager.setScreenBounds(bounds);
      const context = layoutManager.getCurrentContext();

      expect(context.aspectRatio).toBeCloseTo(1.33, 2);
    });

    it('should calculate correct aspect ratio for ultrawide 21:9', () => {
      const bounds: ScreenBounds = {
        x: 0,
        y: 0,
        width: 2560,
        height: 1080,
      };

      layoutManager.setScreenBounds(bounds);
      const context = layoutManager.getCurrentContext();

      expect(context.aspectRatio).toBeCloseTo(2.37, 2);
    });

    it('should calculate correct aspect ratio for portrait tablet', () => {
      const bounds: ScreenBounds = {
        x: 0,
        y: 0,
        width: 768,
        height: 1024,
      };

      layoutManager.setScreenBounds(bounds);
      const context = layoutManager.getCurrentContext();

      expect(context.aspectRatio).toBeCloseTo(0.75, 2);
    });
  });

  describe('Size Breakpoint Detection', () => {
    it('should detect small breakpoint for screens < 1024px width', () => {
      const bounds: ScreenBounds = {
        x: 0,
        y: 0,
        width: 800,
        height: 600,
      };

      layoutManager.setScreenBounds(bounds);
      const context = layoutManager.getCurrentContext();

      expect(context.breakpoint).toBe('sm');
      expect(context.sizeCategory).toBe('small');
    });

    it('should detect medium breakpoint for 1024-1599px width', () => {
      const bounds: ScreenBounds = {
        x: 0,
        y: 0,
        width: 1366,
        height: 768,
      };

      layoutManager.setScreenBounds(bounds);
      const context = layoutManager.getCurrentContext();

      expect(context.breakpoint).toBe('md');
      expect(context.sizeCategory).toBe('medium');
    });

    it('should detect large breakpoint for 1600-2559px width', () => {
      const bounds: ScreenBounds = {
        x: 0,
        y: 0,
        width: 1920,
        height: 1080,
      };

      layoutManager.setScreenBounds(bounds);
      const context = layoutManager.getCurrentContext();

      expect(context.breakpoint).toBe('lg');
      expect(context.sizeCategory).toBe('large');
    });

    it('should detect extra large breakpoint for ≥2560px width', () => {
      const bounds: ScreenBounds = {
        x: 0,
        y: 0,
        width: 3440,
        height: 1440,
      };

      layoutManager.setScreenBounds(bounds);
      const context = layoutManager.getCurrentContext();

      expect(context.breakpoint).toBe('xl');
      expect(context.sizeCategory).toBe('extra-large');
    });

    it('should handle edge case at breakpoint boundaries', () => {
      // Test exactly at 1024px boundary
      const bounds1024: ScreenBounds = {
        x: 0,
        y: 0,
        width: 1024,
        height: 768,
      };
      layoutManager.setScreenBounds(bounds1024);
      expect(layoutManager.getCurrentContext().breakpoint).toBe('md');

      // Test exactly at 1600px boundary
      const bounds1600: ScreenBounds = {
        x: 0,
        y: 0,
        width: 1600,
        height: 900,
      };
      layoutManager.setScreenBounds(bounds1600);
      expect(layoutManager.getCurrentContext().breakpoint).toBe('lg');

      // Test exactly at 2560px boundary
      const bounds2560: ScreenBounds = {
        x: 0,
        y: 0,
        width: 2560,
        height: 1440,
      };
      layoutManager.setScreenBounds(bounds2560);
      expect(layoutManager.getCurrentContext().breakpoint).toBe('xl');
    });
  });

  describe('Device Type Detection', () => {
    it('should detect ultrawide for aspect ratio > 2.1', () => {
      const bounds: ScreenBounds = {
        x: 0,
        y: 0,
        width: 3440,
        height: 1440,
      };

      layoutManager.setScreenBounds(bounds);
      const context = layoutManager.getCurrentContext();

      expect(context.deviceType).toBe('ultrawide');
      expect(context.aspectRatio).toBeGreaterThan(2.1);
    });

    it('should detect wall-display for width > 3000px', () => {
      const bounds: ScreenBounds = {
        x: 0,
        y: 0,
        width: 4096,
        height: 2160,
      };

      layoutManager.setScreenBounds(bounds);
      const context = layoutManager.getCurrentContext();

      expect(context.deviceType).toBe('wall-display');
    });

    it('should detect tablet for unusual aspect ratios with width < 3000px', () => {
      const bounds: ScreenBounds = {
        x: 0,
        y: 0,
        width: 768,
        height: 1024,
      };

      layoutManager.setScreenBounds(bounds);
      const context = layoutManager.getCurrentContext();

      expect(context.deviceType).toBe('small-tablet');
      expect(context.aspectRatio).toBeLessThan(0.8);
    });

    it('should detect laptop as default for standard displays', () => {
      const bounds: ScreenBounds = {
        x: 0,
        y: 0,
        width: 1920,
        height: 1080,
      };

      layoutManager.setScreenBounds(bounds);
      const context = layoutManager.getCurrentContext();

      expect(context.deviceType).toBe('large-laptop');
      expect(context.aspectRatio).toBeGreaterThan(0.8);
      expect(context.aspectRatio).toBeLessThan(2.1);
    });
  });

  describe('Context Properties', () => {
    it('should include screen bounds in context', () => {
      const bounds: ScreenBounds = {
        x: 100,
        y: 50,
        width: 1920,
        height: 1080,
      };

      layoutManager.setScreenBounds(bounds);
      const context = layoutManager.getCurrentContext();

      expect(context.screenBounds).toEqual(bounds);
    });

    it('should return consistent context for same bounds', () => {
      const bounds: ScreenBounds = {
        x: 0,
        y: 0,
        width: 1920,
        height: 1080,
      };

      layoutManager.setScreenBounds(bounds);
      const context1 = layoutManager.getCurrentContext();
      const context2 = layoutManager.getCurrentContext();

      expect(context1).toEqual(context2);
    });

    it('should update context when bounds change', () => {
      const landscapeBounds: ScreenBounds = {
        x: 0,
        y: 0,
        width: 1920,
        height: 1080,
      };
      const portraitBounds: ScreenBounds = {
        x: 0,
        y: 0,
        width: 800,
        height: 1200,
      };

      layoutManager.setScreenBounds(landscapeBounds);
      const landscapeContext = layoutManager.getCurrentContext();

      layoutManager.setScreenBounds(portraitBounds);
      const portraitContext = layoutManager.getCurrentContext();

      expect(landscapeContext.orientation).toBe('landscape');
      expect(portraitContext.orientation).toBe('portrait');
      expect(landscapeContext).not.toEqual(portraitContext);
    });
  });
});
