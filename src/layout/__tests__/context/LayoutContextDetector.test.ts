/**
 * @fileoverview Tests for LayoutContextDetector utility
 *
 * Tests the LayoutContextDetector's ability to:
 * 1. Detect orientation from screen bounds
 * 2. Calculate aspect ratios correctly
 * 3. Categorize device types (including phones and tablets)
 * 4. Determine size breakpoints
 * 5. Generate consistent context keys
 */

import { LayoutContextDetector } from '../../context/LayoutContextDetector';
import { ScreenBounds } from '../../../workspace/types';

describe('LayoutContextDetector', () => {
  describe('detectContext()', () => {
    describe('Orientation Detection', () => {
      it('should detect landscape when width > height', () => {
        const bounds: ScreenBounds = { x: 0, y: 0, width: 1920, height: 1080 };
        const context = LayoutContextDetector.detectContext(bounds);
        expect(context.orientation).toBe('landscape');
      });

      it('should detect portrait when height > width', () => {
        const bounds: ScreenBounds = { x: 0, y: 0, width: 800, height: 1200 };
        const context = LayoutContextDetector.detectContext(bounds);
        expect(context.orientation).toBe('portrait');
      });

      it('should detect landscape when width equals height (square)', () => {
        const bounds: ScreenBounds = { x: 0, y: 0, width: 1000, height: 1000 };
        const context = LayoutContextDetector.detectContext(bounds);
        expect(context.orientation).toBe('landscape');
      });
    });

    describe('Aspect Ratio Calculation', () => {
      it('should calculate correct aspect ratio for 16:9 display', () => {
        const bounds: ScreenBounds = { x: 0, y: 0, width: 1920, height: 1080 };
        const context = LayoutContextDetector.detectContext(bounds);
        expect(context.aspectRatio).toBeCloseTo(1.78, 2);
      });

      it('should calculate correct aspect ratio for 4:3 display', () => {
        const bounds: ScreenBounds = { x: 0, y: 0, width: 1024, height: 768 };
        const context = LayoutContextDetector.detectContext(bounds);
        expect(context.aspectRatio).toBeCloseTo(1.33, 2);
      });

      it('should calculate correct aspect ratio for ultrawide 21:9', () => {
        const bounds: ScreenBounds = { x: 0, y: 0, width: 2560, height: 1080 };
        const context = LayoutContextDetector.detectContext(bounds);
        expect(context.aspectRatio).toBeCloseTo(2.37, 2);
      });

      it('should calculate correct aspect ratio for phone portrait', () => {
        const bounds: ScreenBounds = { x: 0, y: 0, width: 375, height: 812 };
        const context = LayoutContextDetector.detectContext(bounds);
        expect(context.aspectRatio).toBeCloseTo(0.46, 2);
      });
    });

    describe('Size Breakpoint Detection', () => {
      it('should detect small breakpoint for screens < 1024px width', () => {
        const bounds: ScreenBounds = { x: 0, y: 0, width: 800, height: 600 };
        const context = LayoutContextDetector.detectContext(bounds);
        expect(context.breakpoint).toBe('sm');
        expect(context.sizeCategory).toBe('small');
      });

      it('should detect medium breakpoint for 1024-1599px width', () => {
        const bounds: ScreenBounds = { x: 0, y: 0, width: 1366, height: 768 };
        const context = LayoutContextDetector.detectContext(bounds);
        expect(context.breakpoint).toBe('md');
        expect(context.sizeCategory).toBe('medium');
      });

      it('should detect large breakpoint for 1600-2559px width', () => {
        const bounds: ScreenBounds = { x: 0, y: 0, width: 1920, height: 1080 };
        const context = LayoutContextDetector.detectContext(bounds);
        expect(context.breakpoint).toBe('lg');
        expect(context.sizeCategory).toBe('large');
      });

      it('should detect extra large breakpoint for ≥2560px width', () => {
        const bounds: ScreenBounds = { x: 0, y: 0, width: 3440, height: 1440 };
        const context = LayoutContextDetector.detectContext(bounds);
        expect(context.breakpoint).toBe('xl');
        expect(context.sizeCategory).toBe('extra-large');
      });

      it('should handle edge cases at breakpoint boundaries', () => {
        // Test exactly at 1024px boundary
        const bounds1024: ScreenBounds = { x: 0, y: 0, width: 1024, height: 768 };
        expect(LayoutContextDetector.detectContext(bounds1024).breakpoint).toBe('md');

        // Test exactly at 1600px boundary
        const bounds1600: ScreenBounds = { x: 0, y: 0, width: 1600, height: 900 };
        expect(LayoutContextDetector.detectContext(bounds1600).breakpoint).toBe('lg');

        // Test exactly at 2560px boundary
        const bounds2560: ScreenBounds = { x: 0, y: 0, width: 2560, height: 1440 };
        expect(LayoutContextDetector.detectContext(bounds2560).breakpoint).toBe('xl');
      });
    });

    describe('Device Type Detection', () => {
      it('should detect phone for small screens with tall aspect ratios', () => {
        const bounds: ScreenBounds = { x: 0, y: 0, width: 375, height: 812 };
        const context = LayoutContextDetector.detectContext(bounds);
        expect(context.deviceType).toBe('phone');
        expect(context.aspectRatio).toBeLessThan(0.6);
      });

      it('should detect phablet for larger phones', () => {
        const bounds: ScreenBounds = { x: 0, y: 0, width: 600, height: 900 };
        const context = LayoutContextDetector.detectContext(bounds);
        expect(context.deviceType).toBe('phablet');
      });

      it('should detect small-tablet for 8 inch tablets', () => {
        const bounds: ScreenBounds = { x: 0, y: 0, width: 800, height: 1024 };
        const context = LayoutContextDetector.detectContext(bounds);
        expect(context.deviceType).toBe('small-tablet');
      });

      it('should detect large-tablet for 10-12 inch tablets', () => {
        const bounds: ScreenBounds = { x: 0, y: 0, width: 1024, height: 1366 };
        const context = LayoutContextDetector.detectContext(bounds);
        expect(context.deviceType).toBe('large-tablet');
      });

      it('should detect compact-laptop for 13 inch laptops', () => {
        const bounds: ScreenBounds = { x: 0, y: 0, width: 1280, height: 800 };
        const context = LayoutContextDetector.detectContext(bounds);
        expect(context.deviceType).toBe('compact-laptop');
      });

      it('should detect standard-laptop for 15 inch laptops', () => {
        const bounds: ScreenBounds = { x: 0, y: 0, width: 1560, height: 900 };
        const context = LayoutContextDetector.detectContext(bounds);
        expect(context.deviceType).toBe('standard-laptop');
      });

      it('should detect large-laptop for 17 inch laptops', () => {
        const bounds: ScreenBounds = { x: 0, y: 0, width: 1920, height: 1080 };
        const context = LayoutContextDetector.detectContext(bounds);
        expect(context.deviceType).toBe('large-laptop');
      });

      it('should detect desktop for external monitors', () => {
        // 2560x1200 21:10 monitor (desktop)
        const bounds: ScreenBounds = { x: 0, y: 0, width: 2560, height: 1200 };
        const context = LayoutContextDetector.detectContext(bounds);
        expect(context.deviceType).toBe('desktop');
      });

      it('should detect tv for large consumer displays', () => {
        // 2560x1440 16:9 monitor (tv)
        const bounds: ScreenBounds = { x: 0, y: 0, width: 2560, height: 1440 };
        const context = LayoutContextDetector.detectContext(bounds);
        expect(context.deviceType).toBe('tv');
      });

      it('should detect foldable for unfolded devices', () => {
        const bounds: ScreenBounds = { x: 0, y: 0, width: 1000, height: 500 };
        const context = LayoutContextDetector.detectContext(bounds);
        expect(context.deviceType).toBe('foldable');
      });

      it('should detect ultrawide for aspect ratio > 2.1', () => {
        const bounds: ScreenBounds = { x: 0, y: 0, width: 3440, height: 1440 };
        const context = LayoutContextDetector.detectContext(bounds);
        expect(context.deviceType).toBe('ultrawide');
        expect(context.aspectRatio).toBeGreaterThan(2.1);
      });

      it('should detect wall-display for width > 3000px', () => {
        const bounds: ScreenBounds = { x: 0, y: 0, width: 4096, height: 2160 };
        const context = LayoutContextDetector.detectContext(bounds);
        expect(context.deviceType).toBe('wall-display');
      });
    });

    describe('Context Properties', () => {
      it('should include all required properties', () => {
        const bounds: ScreenBounds = { x: 100, y: 50, width: 1920, height: 1080 };
        const context = LayoutContextDetector.detectContext(bounds);

        expect(context).toHaveProperty('orientation');
        expect(context).toHaveProperty('aspectRatio');
        expect(context).toHaveProperty('breakpoint');
        expect(context).toHaveProperty('sizeCategory');
        expect(context).toHaveProperty('deviceType');
        expect(context).toHaveProperty('screenBounds');
        expect(context.screenBounds).toEqual(bounds);
      });

      it('should return consistent results for same bounds', () => {
        const bounds: ScreenBounds = { x: 0, y: 0, width: 1920, height: 1080 };
        const context1 = LayoutContextDetector.detectContext(bounds);
        const context2 = LayoutContextDetector.detectContext(bounds);
        expect(context1).toEqual(context2);
      });
    });
  });

  describe('generateContextKey()', () => {
    it('should generate correct key format', () => {
      const bounds: ScreenBounds = { x: 0, y: 0, width: 1920, height: 1080 };
      const context = LayoutContextDetector.detectContext(bounds);
      const key = LayoutContextDetector.generateContextKey(context);

      expect(key).toBe('landscape-lg-1920x1080');
    });

    it('should generate unique keys for different contexts', () => {
      const landscape: ScreenBounds = { x: 0, y: 0, width: 1920, height: 1080 };
      const portrait: ScreenBounds = { x: 0, y: 0, width: 800, height: 1200 };

      const landscapeKey = LayoutContextDetector.generateContextKey(
        LayoutContextDetector.detectContext(landscape)
      );
      const portraitKey = LayoutContextDetector.generateContextKey(
        LayoutContextDetector.detectContext(portrait)
      );

      expect(landscapeKey).toBe('landscape-lg-1920x1080');
      expect(portraitKey).toBe('portrait-sm-800x1200');
      expect(landscapeKey).not.toBe(portraitKey);
    });

    it('should handle various screen sizes', () => {
      const testCases = [
        { bounds: { x: 0, y: 0, width: 375, height: 812 }, expected: 'portrait-sm-375x812' },
        { bounds: { x: 0, y: 0, width: 1366, height: 768 }, expected: 'landscape-md-1366x768' },
        { bounds: { x: 0, y: 0, width: 3440, height: 1440 }, expected: 'landscape-xl-3440x1440' },
      ];

      testCases.forEach(({ bounds, expected }) => {
        const context = LayoutContextDetector.detectContext(bounds);
        const key = LayoutContextDetector.generateContextKey(context);
        expect(key).toBe(expected);
      });
    });
  });
});
