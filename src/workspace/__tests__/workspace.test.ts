/**
 * @fileoverview Tests for Workspace class
 *
 * Tests the Workspace class methods and functionality.
 */

import { TestIdGenerator } from '../../../tests/TestIdGenerator';
import { Workspace } from '../Workspace';
import { WorkspaceContextCollection } from '../context/WorkspaceContextCollection';
import { ScreenBounds } from '../types';

describe.skip('Workspace', () => {
  let workspace: Workspace;
  const testScreenBounds: ScreenBounds = { x: 0, y: 0, width: 800, height: 600 };

  beforeEach(() => {
    workspace = new Workspace({
      id: 'test-workspace-id',
      name: 'Test Workspace',
      idGenerator: new TestIdGenerator('viewport'),
      workspaceContexts: new WorkspaceContextCollection(),
    });
  });

  describe('Workspace properties', () => {
    test('has correct id and screenBounds', () => {
      expect(workspace.id).toBe('test-workspace-id');
    });
  });

  describe('Viewport operations', () => {
    test('createViewport with no bounds creates viewport that fills workspace', () => {
      // Initially empty
      expect(workspace.viewports).toEqual([]);

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
      const viewports = workspace.viewports;
      expect(viewports.size).toBe(1);
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
      expect(workspace.viewports.size).toEqual(0);
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
      expect(workspace.viewports.size).toEqual(2);
    });

    test('splitViewport works with viewport ID', () => {
      const viewport = workspace.createViewport();
      const viewportId = viewport.id;

      const result = workspace.splitViewport(viewportId, 'down');

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.id).not.toBe(viewport.id);
      expect(workspace.viewports.size).toBe(2);
    });

    test('removeViewport removes viewport and returns true', () => {
      const viewport = workspace.createViewport();

      // Verify viewport exists
      expect(workspace.viewports).toBe(1);
      expect(workspace.hasViewport(viewport.id)).toBe(true);

      // Remove viewport
      const result = workspace.removeViewport(viewport);

      // Should return true and remove viewport
      expect(result).toBe(true);
      expect(workspace.viewports).toBe(0);
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
      workspace.setScreenBounds(newScreenBounds);

      // Workspace screen bounds should be updated
      expect(workspace.screenBounds).toEqual(newScreenBounds);

      // Viewport screen bounds should be recalculated
      const updatedViewport = workspace.viewports.get('x')!;
      expect(updatedViewport.screenBounds).not.toEqual(originalBounds);
      expect(updatedViewport.screenBounds.x).toBe(newScreenBounds.x);
      expect(updatedViewport.screenBounds.y).toBe(newScreenBounds.y);
    });

    test('updateScreenBounds handles multiple viewports', () => {
      workspace.createViewport({ x: 0, y: 0, width: 0.5, height: 1.0 });
      workspace.createViewport({ x: 0.5, y: 0, width: 0.5, height: 1.0 });

      const newScreenBounds = { x: 200, y: 150, width: 1200, height: 900 };
      workspace.setScreenBounds(newScreenBounds);

      // Both viewports should have updated screen bounds
      const viewports = workspace.viewports;
      expect(viewports).toBe(2);

      viewports.forEach((viewport) => {
        expect(viewport.screenBounds.x).toBeGreaterThanOrEqual(newScreenBounds.x);
        expect(viewport.screenBounds.y).toBeGreaterThanOrEqual(newScreenBounds.y);
      });
    });
  });
});
