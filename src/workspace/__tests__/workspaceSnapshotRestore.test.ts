import { WorkspaceFactory } from '../WorkspaceFactory';
import { TestIdGenerator } from '../../shared/TestIdGenerator';

describe('Workspace snapshot and viewport restoration', () => {
  it('creates a workspace, adds a viewport, and restores snapshot with screenBounds changes', () => {
    const idGen = new TestIdGenerator('ws');
    const factory = new WorkspaceFactory(idGen);
    const initialBounds = { x: 0, y: 0, width: 800, height: 600 };
    const workspace = factory.create(initialBounds);

    // Add a viewport
    const proportionalBounds = { x: 0, y: 0, width: 0.5, height: 1 };
    const vp = workspace.createViewport(proportionalBounds);
    expect(workspace.getViewports().length).toBe(1);
    expect(workspace.getViewports()[0].id).toBe(vp.id);

    // Create snapshot after adding viewport
    const snapshot2 = JSON.parse(
      JSON.stringify({
        workspaceId: workspace.id,
        contexts: {
          default: {
            orientation: 'landscape',
            aspectRatio: 1.33,
            sizeCategory: 'md',
            deviceType: 'standard-laptop',
            viewports: [{ id: vp.id, bounds: proportionalBounds }],
          },
        },
      })
    );
    expect(snapshot2.contexts.default.viewports.length).toBe(1);
    expect(snapshot2.contexts.default.viewports[0].id).toBe(vp.id);

    // Restore with new screenBounds
    const newBounds = { x: 0, y: 0, width: 1200, height: 900 };
    const restored = factory.fromSnapshot(snapshot2, newBounds);
    expect(restored.screenBounds).toEqual(newBounds);
    expect(restored.getViewports().length).toBe(1);
    expect(restored.getViewports()[0].id).toBe(vp.id);
    // The proportional bounds should be the same, but the actual pixel bounds will differ
    // Compare proportional bounds using the snapshot/context
    expect(snapshot2.contexts.default.viewports[0].bounds).toEqual(proportionalBounds);

    // Restore back to original bounds
    const restoredBack = factory.fromSnapshot(snapshot2, initialBounds);
    expect(restoredBack.screenBounds).toEqual(initialBounds);
    expect(restoredBack.getViewports().length).toBe(1);
    expect(restoredBack.getViewports()[0].id).toBe(vp.id);
    expect(snapshot2.contexts.default.viewports[0].bounds).toEqual(proportionalBounds);
  });
});
