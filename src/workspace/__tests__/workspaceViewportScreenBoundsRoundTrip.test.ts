import { createTestWorkspaceFromSnapshotData } from '../../../tests/testWorkspaceFactory';

describe('Workspace viewport and screenBounds round-trip', () => {
  it('preserves viewports and recalculates screenBounds correctly when resizing and restoring', () => {
    // Use the laptop context from the snapshot as a test subject
    const initialScreenBounds = { x: 0, y: 0, width: 800, height: 600 };
    const workspace = createTestWorkspaceFromSnapshotData({
      workspaceContexts: [
        {
          id: 'laptop',
          name: 'Laptop Display',
          minimumViewportScreenHeight: 300,
          minimumViewportScreenWidth: 300,
          aspectRatio: 1.6,
          sizeCategory: 'md',
          deviceType: 'standard-laptop',
          maxScreenBounds: initialScreenBounds,
          orientation: 'landscape',
          viewportSnapshots: [
            {
              id: 'main',
              bounds: { x: 0, y: 0, width: 0.75, height: 1 },
              isDefault: true,
              isMaximized: false,
              isMinimized: false,
              isRequired: true,
              timestamp: 1639547653212,
            },
            {
              id: 'side',
              bounds: { x: 0.75, y: 0, width: 0.25, height: 1 },
              isDefault: false,
              isMaximized: false,
              isMinimized: false,
              isRequired: false,
              timestamp: 1639547653213,
            },
          ],
        },
      ],
    });

    // Find the 'main' viewport
    const vp = workspace.getViewports().find((v) => v.id === 'main')!;
    const originalScreenBounds = { ...vp.screenBounds };

    // Change screen bounds
    const newBounds = { x: 0, y: 0, width: 1200, height: 900 };
    workspace.setScreenBounds(newBounds);
    const vpAfterResize = workspace.getViewports().find((v) => v.id === 'main')!;
    expect(vpAfterResize).toBeDefined();
    expect(vpAfterResize.screenBounds).toEqual({
      x: 0,
      y: 0,
      width: 0.75 * newBounds.width,
      height: 1 * newBounds.height,
    });

    // Change screen bounds back to original
    workspace.setScreenBounds(initialScreenBounds);
    const vpAfterRestore = workspace.getViewports().find((v) => v.id === 'main')!;
    expect(vpAfterRestore).toBeDefined();
    expect(vpAfterRestore.screenBounds).toEqual(originalScreenBounds);
  });
});
