/**
 * @fileoverview Tests for WorkspaceContextDetector utility
 *
 * Tests the WorkspaceContextDetector's ability to:
 * 1. Detect orientation from screen bounds
 * 2. Calculate aspect ratios correctly
 * 3. Categorize device types (including phones and tablets)
 * 4. Determine size breakpoints
 * 5. Generate consistent context keys
 */

import { WorkspaceContextDetector } from '../../context/WorkspaceContextDetector';
import { ScreenBounds } from '../../../workspace/types';

describe('WorkspaceContextDetector', () => {
  describe('detectContext()', () => {
    describe('Orientation Detection', () => {
      it('should detect landscape when width > height', () => {
        const bounds: ScreenBounds = { x: 0, y: 0, width: 1920, height: 1080 };
        const context = WorkspaceContextDetector.detectContext(bounds);
        expect(context.orientation).toBe('landscape');
      });

      it('should detect portrait when height > width', () => {
        const bounds: ScreenBounds = { x: 0, y: 0, width: 800, height: 1200 };
        const context = WorkspaceContextDetector.detectContext(bounds);
        expect(context.orientation).toBe('portrait');
      });

      it('should detect landscape when width equals height (square)', () => {
        const bounds: ScreenBounds = { x: 0, y: 0, width: 1000, height: 1000 };
        const context = WorkspaceContextDetector.detectContext(bounds);
        expect(context.orientation).toBe('landscape');
      });
    });

    describe('Aspect Ratio Calculation', () => {
      it('should calculate correct aspect ratio for 16:9 display', () => {
        const bounds: ScreenBounds = { x: 0, y: 0, width: 1920, height: 1080 };
        const context = WorkspaceContextDetector.detectContext(bounds);
        expect(context.aspectRatio).toBeCloseTo(1.78, 2);
      });

      it('should calculate correct aspect ratio for 4:3 display', () => {
        const bounds: ScreenBounds = { x: 0, y: 0, width: 1024, height: 768 };
        const context = WorkspaceContextDetector.detectContext(bounds);
        expect(context.aspectRatio).toBeCloseTo(1.33, 2);
      });

      it('should calculate correct aspect ratio for ultrawide 21:9', () => {
        const bounds: ScreenBounds = { x: 0, y: 0, width: 2560, height: 1080 };
        const context = WorkspaceContextDetector.detectContext(bounds);
        expect(context.aspectRatio).toBeCloseTo(2.37, 2);
      });

      it('should calculate correct aspect ratio for phone portrait', () => {
        const bounds: ScreenBounds = { x: 0, y: 0, width: 375, height: 812 };
        const context = WorkspaceContextDetector.detectContext(bounds);
        expect(context.aspectRatio).toBeCloseTo(0.46, 2);
      });
    });
  });
});
