import { ScreenBounds } from '../../workspace';
import { createTestWorkspaceContextCollection } from '../../../tests/testWorkspaceContextUtils';
import { ViewportManager } from '../ViewportManager';
import { createTestWorkspaceFromSnapshotData } from '../../../tests/testWorkspaceFactory';
import { TestIdGenerator } from '../../../tests/TestIdGenerator';

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
      const foundViewport = workspace.viewportManager.findViewportById('main');

      // expect(foundViewport).toBe(viewport);
      expect(foundViewport?.id).toBe('main');
    });

    it('should return null when ID does not exist', () => {
      // Try to find non-existent viewport
      const foundViewport = viewportManager.findViewportById('non-existent-id');

      expect(foundViewport).toBeNull();
    });

    it('should return correct viewport when multiple viewports exist', () => {
      // Create a workspace with multiple viewports using snapshot data overrides
      const workspace = createTestWorkspaceFromSnapshotData({
        viewports: [
          { id: 'vp1', bounds: { x: 0, y: 0, width: 0.5, height: 0.5 } },
          { id: 'vp2', bounds: { x: 0.5, y: 0, width: 0.5, height: 0.5 } },
          { id: 'vp3', bounds: { x: 0, y: 0.5, width: 1.0, height: 0.5 } },
        ],
      });
      workspace.setScreenBounds(testWorkspaceBounds);
      const { viewportManager } = workspace;

      // Find each viewport by ID
      const vp1 = viewportManager.findViewportById('vp1');
      const vp2 = viewportManager.findViewportById('vp2');
      const vp3 = viewportManager.findViewportById('vp3');
      expect(vp1?.id).toBe('vp1');
      expect(vp2?.id).toBe('vp2');
      expect(vp3?.id).toBe('vp3');
    });

    it('should return null for empty string ID', () => {
      const foundViewport = viewportManager.findViewportById('');
      expect(foundViewport).toBeNull();
    });
  });
});
