import { WorkspaceFactory } from '..';
import { loadDesktopSnapshot } from '../../shared/test/loadDesktopSnapshot';
import { TestIdGenerator } from '../../../tests/TestIdGenerator';

describe('Workspace viewport and screenBounds round-trip', () => {
  it('preserves viewports and recalculates screenBounds correctly when resizing and restoring', () => {
    // Use the laptop context from the snapshot as a test subject
    const idGenerator = new TestIdGenerator('test');
    const workspaceFactory = new WorkspaceFactory(idGenerator);
    const snapshot = loadDesktopSnapshot();

    const initialScreenBounds = { x: 0, y: 0, width: 800, height: 600 };
    const workspace = workspaceFactory.fromSnapshot(snapshot, initialScreenBounds);

    // Find the 'main' viewport
    const mainViewport = workspace.viewports.get('main')!;
    const originalScreenBounds = { ...mainViewport.screenBounds };

    // Change screen bounds
    const newBounds = { x: 0, y: 0, width: 1200, height: 900 };
    workspace.setScreenBounds(newBounds);
    const vpAfterResize = workspace.viewports.get('main')!;
    expect(vpAfterResize).toBeDefined();
    expect(vpAfterResize.screenBounds).toEqual({
      x: 0,
      y: 0,
      width: 0.75 * newBounds.width,
      height: 1 * newBounds.height,
    });

    // Change screen bounds back to original
    workspace.setScreenBounds(initialScreenBounds);
    const vpAfterRestore = workspace.viewports.get('main')!;
    expect(vpAfterRestore).toBeDefined();
    expect(vpAfterRestore.screenBounds).toEqual(originalScreenBounds);
  });
});
