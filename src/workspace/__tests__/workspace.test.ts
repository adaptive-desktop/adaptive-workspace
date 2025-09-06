/**
 * @fileoverview Tests for Workspace class
 *
 * Tests the Workspace class methods and functionality.
 */

import { Workspace } from '../Workspace';
import { ScreenBounds } from '../types';

describe('Workspace', () => {
  let workspace: Workspace;
  const testPosition: ScreenBounds = { x: 0, y: 0, width: 800, height: 600 };

  beforeEach(() => {
    workspace = new Workspace({
      id: 'test-workspace-id',
      position: testPosition,
    });
  });

  describe('Workspace properties', () => {
    test('has correct id and position', () => {
      expect(workspace.id).toBe('test-workspace-id');
      expect(workspace.position).toEqual(testPosition);
    });

    test('has layout manager', () => {
      expect(workspace.layout).toBeDefined();
      expect(workspace.layout.getViewportCount()).toBe(0);
    });
  });

  describe('Viewport operations', () => {
    test('createViewport with no bounds creates viewport that fills workspace', () => {
      // Initially empty
      expect(workspace.getViewports()).toEqual([]);

      // Create viewport with default bounds (full workspace)
      const viewport = workspace.createViewport();

      // Should return viewport object
      expect(viewport).toBeDefined();
      expect(viewport.id).toBeDefined();
      expect(viewport.id.length).toBeGreaterThan(0);

      // Should have calculated screen bounds matching workspace
      expect(viewport.screenBounds).toEqual({
        x: testPosition.x,
        y: testPosition.y,
        width: testPosition.width,
        height: testPosition.height,
      });

      // Should be in viewport list
      const viewports = workspace.getViewports();
      expect(viewports).toHaveLength(1);
      expect(viewports[0].id).toBe(viewport.id);
    });

    test('createViewport with specific bounds creates viewport at specified location', () => {
      // Create viewport in right third of workspace
      const viewport = workspace.createViewport({
        x: 0.6667,
        y: 0,
        width: 0.3333,
        height: 1.0,
      });

      // Should have calculated screen bounds for right third
      expect(viewport.screenBounds).toEqual({
        x: testPosition.x + testPosition.width * 0.6667, // ~533
        y: testPosition.y, // 0
        width: testPosition.width * 0.3333, // ~267
        height: testPosition.height, // 600
      });
    });

    test('createAdjacentViewport throws (not implemented)', () => {
      const viewport = workspace.createViewport();

      expect(() => workspace.createAdjacentViewport([viewport], 'left')).toThrow(
        'createAdjacentViewport not yet implemented'
      );
    });

    test('getViewports returns empty array initially', () => {
      expect(workspace.getViewports()).toEqual([]);
    });

    test('hasViewport returns false for non-existent viewport', () => {
      expect(workspace.hasViewport('non-existent')).toBe(false);
    });

    test('splitViewport throws (not implemented)', () => {
      const viewport = workspace.createViewport();

      expect(() => workspace.splitViewport(viewport, 'horizontal')).toThrow(
        'splitViewport not yet implemented'
      );
    });

    test('removeViewport removes viewport and returns true', () => {
      const viewport = workspace.createViewport();

      // Verify viewport exists
      expect(workspace.getViewports()).toHaveLength(1);
      expect(workspace.hasViewport(viewport.id)).toBe(true);

      // Remove viewport
      const result = workspace.removeViewport(viewport);

      // Should return true and remove viewport
      expect(result).toBe(true);
      expect(workspace.getViewports()).toHaveLength(0);
      expect(workspace.hasViewport(viewport.id)).toBe(false);
    });

    test('swapViewports returns false (not implemented)', () => {
      const viewport1 = workspace.createViewport({ x: 0, y: 0, width: 0.5, height: 1.0 });
      const viewport2 = workspace.createViewport({ x: 0.5, y: 0, width: 0.5, height: 1.0 });

      const result = workspace.swapViewports(viewport1, viewport2);

      expect(result).toBe(false);
    });

    test('updatePosition updates workspace position and propagates to viewports', () => {
      const viewport = workspace.createViewport();
      const originalBounds = viewport.screenBounds;

      const newPosition = { x: 100, y: 100, width: 1000, height: 800 };
      workspace.updatePosition(newPosition);

      // Workspace position should be updated
      expect(workspace.position).toEqual(newPosition);

      // Viewport screen bounds should be recalculated
      const updatedViewport = workspace.getViewports()[0];
      expect(updatedViewport.screenBounds).not.toEqual(originalBounds);
      expect(updatedViewport.screenBounds.x).toBe(newPosition.x);
      expect(updatedViewport.screenBounds.y).toBe(newPosition.y);
    });

    test('updatePosition handles multiple viewports', () => {
      workspace.createViewport({ x: 0, y: 0, width: 0.5, height: 1.0 });
      workspace.createViewport({ x: 0.5, y: 0, width: 0.5, height: 1.0 });

      const newPosition = { x: 200, y: 150, width: 1200, height: 900 };
      workspace.updatePosition(newPosition);

      // Both viewports should have updated screen bounds
      const viewports = workspace.getViewports();
      expect(viewports).toHaveLength(2);

      viewports.forEach((viewport) => {
        expect(viewport.screenBounds.x).toBeGreaterThanOrEqual(newPosition.x);
        expect(viewport.screenBounds.y).toBeGreaterThanOrEqual(newPosition.y);
      });
    });
  });
});
