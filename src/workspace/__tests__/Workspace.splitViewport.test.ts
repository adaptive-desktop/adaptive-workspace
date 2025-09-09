/**
 * @fileoverview Tests for Workspace splitViewport with ID resolution
 *
 * Tests that Workspace can accept both viewport objects and IDs for splitViewport
 */

import { Workspace } from '../Workspace';
import { ScreenBounds } from '../types';
import { TestIdGenerator } from '../../shared/TestIdGenerator';

describe('Workspace - splitViewport with ID resolution', () => {
  let workspace: Workspace;
  const testWorkspaceBounds: ScreenBounds = {
    x: 0,
    y: 0,
    width: 1000,
    height: 800,
  };

  beforeEach(() => {
    workspace = new Workspace({
      id: 'test-workspace',
      screenBounds: testWorkspaceBounds,
      idGenerator: new TestIdGenerator('viewport'),
    });
  });

  describe('splitViewport() with viewport object', () => {
    it('should work with viewport object', () => {
      // Create initial viewport
      const originalViewport = workspace.createViewport();

      // Split using viewport object
      const result = workspace.splitViewport(originalViewport, 'down');

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.id).not.toBe(originalViewport.id);

      // Check that both viewports exist
      const allViewports = workspace.getViewports();
      expect(allViewports).toHaveLength(2);
      expect(allViewports).toContain(originalViewport);

      const newViewport = workspace.layout.findViewportById(result.id);
      expect(newViewport).toBeDefined();
      expect(allViewports).toContain(newViewport!);
    });
  });

  describe('splitViewport() with viewport ID', () => {
    it('should work with viewport ID string', () => {
      // Create initial viewport
      const originalViewport = workspace.createViewport();
      const viewportId = originalViewport.id;

      // Split using viewport ID
      const result = workspace.splitViewport(viewportId, 'down');

      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
      expect(result.id).not.toBe(originalViewport.id);

      // Check that both viewports exist
      const allViewports = workspace.getViewports();
      expect(allViewports).toHaveLength(2);
      expect(allViewports).toContain(originalViewport);

      const newViewport = workspace.layout.findViewportById(result.id);
      expect(newViewport).toBeDefined();
      expect(allViewports).toContain(newViewport!);
    });

    it('should throw error for non-existent viewport ID', () => {
      // Try to split non-existent viewport
      expect(() => {
        workspace.splitViewport('non-existent-id', 'down');
      }).toThrow('Viewport not found: non-existent-id');
    });

    it('should throw error for empty string ID', () => {
      // Try to split with empty string
      expect(() => {
        workspace.splitViewport('', 'down');
      }).toThrow('Viewport not found: ');
    });
  });

  describe('splitViewport() behavior consistency', () => {
    it('should produce same result whether using object or ID', () => {
      // Create two identical workspaces
      const workspace1 = new Workspace({
        id: 'test-workspace-1',
        screenBounds: testWorkspaceBounds,
        idGenerator: new TestIdGenerator('viewport1'),
      });
      const workspace2 = new Workspace({
        id: 'test-workspace-2',
        screenBounds: testWorkspaceBounds,
        idGenerator: new TestIdGenerator('viewport2'),
      });

      // Create initial viewports
      const viewport1 = workspace1.createViewport();
      const viewport2 = workspace2.createViewport();

      // Split one using object, one using ID
      const result1 = workspace1.splitViewport(viewport1, 'right');
      const result2 = workspace2.splitViewport(viewport2.id, 'right');

      // Both should have same proportional bounds
      expect(viewport1.screenBounds).toEqual(viewport2.screenBounds);

      const newViewport1 = workspace1.layout.findViewportById(result1.id);
      const newViewport2 = workspace2.layout.findViewportById(result2.id);
      expect(newViewport1?.screenBounds).toEqual(newViewport2?.screenBounds);
    });
  });
});
