import { ScreenBounds } from '../../workspace';
import { createTestWorkspaceContextCollection } from '../../../tests/testWorkspaceContextUtils';
import { ViewportManager } from '../ViewportManager';
import { createTestWorkspaceFromSnapshotData } from '../../../tests/testWorkspaceFactory';

describe('ViewportManager - findViewportById()', () => {
  let viewportManager: ViewportManager;
  const testWorkspaceBounds: ScreenBounds = {
    x: 0,
    y: 0,
    width: 1000,
    height: 800,
  };

  beforeEach(() => {
    viewportManager = new ViewportManager(
      createTestWorkspaceContextCollection([], testWorkspaceBounds),
      new TestIdGenerator('viewport')
    );
    viewportManager.setScreenBounds(testWorkspaceBounds);
  });

  describe('findViewportById()', () => {
    it('should return viewport when ID exists', () => {
      // Create a viewport with explicit bounds
      const workspace = createTestWorkspaceFromSnapshotData();
      workspace.setScreenBounds(testWorkspaceBounds); // sets up proper context and regenerates viewports

      // Find viewport by ID
      const foundViewport = workspace.viewportManager.findViewportById(viewport.id);

      expect(foundViewport).toBe(viewport);
      expect(foundViewport?.id).toBe(viewport.id);
    });

    it('should return null when ID does not exist', () => {
      // Try to find non-existent viewport
      const foundViewport = viewportManager.findViewportById('non-existent-id');

      expect(foundViewport).toBeNull();
    });

    it('should return correct viewport when multiple viewports exist', () => {
      // Create multiple viewports with explicit bounds
      const viewport1 = viewportManager.createViewport({ x: 0, y: 0, width: 0.5, height: 0.5 });
      const viewport2 = viewportManager.createViewport({ x: 0.5, y: 0, width: 0.5, height: 0.5 });
      const viewport3 = viewportManager.createViewport({ x: 0, y: 0.5, width: 1.0, height: 0.5 });

      // Find each viewport by ID
      expect(viewportManager.findViewportById(viewport1.id)).toBe(viewport1);
      expect(viewportManager.findViewportById(viewport2.id)).toBe(viewport2);
      expect(viewportManager.findViewportById(viewport3.id)).toBe(viewport3);
    });

    it('should return null for empty string ID', () => {
      const foundViewport = viewportManager.findViewportById('');
      expect(foundViewport).toBeNull();
    });
  });
});
