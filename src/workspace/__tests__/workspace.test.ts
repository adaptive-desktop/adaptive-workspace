/**
 * @fileoverview Tests for Workspace class
 *
 * Tests the Workspace class methods and functionality.
 */

import { Workspace } from '../Workspace';
import { ScreenBounds } from '../types';
import { TestIdGenerator } from '../../shared/TestIdGenerator';

describe('Workspace', () => {
  let workspace: Workspace;
  const testScreenBounds: ScreenBounds = { x: 0, y: 0, width: 800, height: 600 };

  beforeEach(() => {
    workspace = new Workspace({
      id: 'test-workspace-id',
      screenBounds: testScreenBounds,
      idGenerator: new TestIdGenerator('viewport'),
    });
  });

  describe('Workspace properties', () => {
    test('has correct id and screenBounds', () => {
      expect(workspace.id).toBe('test-workspace-id');
      expect(workspace.screenBounds).toEqual(testScreenBounds);
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
        x: testScreenBounds.x,
        y: testScreenBounds.y,
        width: testScreenBounds.width,
        height: testScreenBounds.height,
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
        x: testScreenBounds.x + testScreenBounds.width * 0.6667, // ~533
        y: testScreenBounds.y, // 0
        width: testScreenBounds.width * 0.3333, // ~267
        height: testScreenBounds.height, // 600
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

    test('splitViewport works correctly', () => {
      const viewport = workspace.createViewport();

      const result = workspace.splitViewport(viewport, 'down');

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.id).not.toBe(viewport.id);
      expect(workspace.getViewports()).toHaveLength(2);
    });

    test('splitViewport works with viewport ID', () => {
      const viewport = workspace.createViewport();
      const viewportId = viewport.id;

      const result = workspace.splitViewport(viewportId, 'down');

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.id).not.toBe(viewport.id);
      expect(workspace.getViewports()).toHaveLength(2);
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

    test('updateScreenBounds updates workspace position and propagates to viewports', () => {
      const viewport = workspace.createViewport();
      const originalBounds = viewport.screenBounds;

      const newScreenBounds = { x: 100, y: 100, width: 1000, height: 800 };
      workspace.updateScreenBounds(newScreenBounds);

      // Workspace screen bounds should be updated
      expect(workspace.screenBounds).toEqual(newScreenBounds);

      // Viewport screen bounds should be recalculated
      const updatedViewport = workspace.getViewports()[0];
      expect(updatedViewport.screenBounds).not.toEqual(originalBounds);
      expect(updatedViewport.screenBounds.x).toBe(newScreenBounds.x);
      expect(updatedViewport.screenBounds.y).toBe(newScreenBounds.y);
    });

    test('updateScreenBounds handles multiple viewports', () => {
      workspace.createViewport({ x: 0, y: 0, width: 0.5, height: 1.0 });
      workspace.createViewport({ x: 0.5, y: 0, width: 0.5, height: 1.0 });

      const newScreenBounds = { x: 200, y: 150, width: 1200, height: 900 };
      workspace.updateScreenBounds(newScreenBounds);

      // Both viewports should have updated screen bounds
      const viewports = workspace.getViewports();
      expect(viewports).toHaveLength(2);

      viewports.forEach((viewport) => {
        expect(viewport.screenBounds.x).toBeGreaterThanOrEqual(newScreenBounds.x);
        expect(viewport.screenBounds.y).toBeGreaterThanOrEqual(newScreenBounds.y);
      });
    });
  });
});
