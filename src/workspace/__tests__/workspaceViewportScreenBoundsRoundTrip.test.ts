import { WorkspaceFactory } from '../WorkspaceFactory';
import { TestIdGenerator } from '../../shared/TestIdGenerator';

describe('Workspace viewport and screenBounds round-trip', () => {
  it('preserves viewports and recalculates screenBounds correctly when resizing and restoring', () => {
    const idGen = new TestIdGenerator('ws');
    const factory = new WorkspaceFactory(idGen);
    const initialBounds = { x: 0, y: 0, width: 800, height: 600 };
    const workspace = factory.create(initialBounds);

    // Add a viewport with proportional bounds
    const proportionalBounds = { x: 0, y: 0, width: 0.5, height: 1 };
    const vp = workspace.createViewport(proportionalBounds);
    const originalId = vp.id;
    const originalScreenBounds = { ...vp.screenBounds };

    // Change screen bounds
    const newBounds = { x: 0, y: 0, width: 1200, height: 900 };
    workspace.updateScreenBounds(newBounds);
    const vpAfterResize = workspace.getViewports().find((v) => v.id === originalId)!;
    expect(vpAfterResize).toBeDefined();
    expect(vpAfterResize.screenBounds).toEqual({
      x: 0,
      y: 0,
      width: 0.5 * newBounds.width,
      height: 1 * newBounds.height,
    });

    // Change screen bounds back to original
    workspace.updateScreenBounds(initialBounds);
    const vpAfterRestore = workspace.getViewports().find((v) => v.id === originalId)!;
    expect(vpAfterRestore).toBeDefined();
    expect(vpAfterRestore.screenBounds).toEqual(originalScreenBounds);
  });
});
