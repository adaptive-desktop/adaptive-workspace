/**
 * @fileoverview Tests for WorkspaceFactory
 *
 * Tests the WorkspaceFactory class and workspace creation methods.
 */

import { WorkspaceFactory } from '../';
import { Workspace } from '../Workspace';

describe('WorkspaceFactory', () => {
  describe('WorkspaceFactory.create', () => {
    test('creates workspace with auto-generated id', () => {
      const workspace = WorkspaceFactory.create({ x: 100, y: 200, width: 800, height: 600 });

      expect(workspace.id).toBeDefined();
      expect(workspace.id.length).toBeGreaterThan(0);
      expect(workspace.screenBounds).toEqual({ x: 100, y: 200, width: 800, height: 600 });
      expect(workspace.layout.getViewportCount()).toBe(0);
    });

    test('returns Workspace instance', () => {
      const workspace = WorkspaceFactory.create({ x: 0, y: 0, width: 800, height: 600 });

      expect(workspace).toBeInstanceOf(Workspace);
    });

    test('sets correct screenBounds', () => {
      const screenBounds = { x: 100, y: 200, width: 1920, height: 1080 };
      const workspace = WorkspaceFactory.create(screenBounds);

      expect(workspace.screenBounds).toEqual(screenBounds);
    });

    test('creates workspace with empty layout', () => {
      const workspace = WorkspaceFactory.create({ x: 0, y: 0, width: 800, height: 600 });

      expect(workspace.layout.getViewportCount()).toBe(0);
    });

    test('generates unique IDs', () => {
      const workspace1 = WorkspaceFactory.create({ x: 0, y: 0, width: 800, height: 600 });
      const workspace2 = WorkspaceFactory.create({ x: 0, y: 0, width: 800, height: 600 });

      expect(workspace1.id).not.toBe(workspace2.id);
      expect(workspace1.id.length).toBeGreaterThan(0);
      expect(workspace2.id.length).toBeGreaterThan(0);
    });
  });

  describe('WorkspaceFactory.createWithViewport', () => {
    test('creates workspace (viewport creation not yet implemented)', () => {
      const workspace = WorkspaceFactory.createWithViewport({
        x: 0,
        y: 0,
        width: 800,
        height: 600,
      });

      expect(workspace).toBeInstanceOf(Workspace);
      expect(workspace.layout.getViewportCount()).toBe(0); // Will be 1 when implemented
    });
  });
});
