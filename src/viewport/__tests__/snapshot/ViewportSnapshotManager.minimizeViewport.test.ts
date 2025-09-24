import { ViewportSnapshotManager } from '../../snapshot/ViewportSnapshotManager';
import { WorkspaceContext } from '../../../workspace/types';
import { ProportionalBounds } from '../../../workspace/types';
import { ViewportSnapshotCollection } from '../../snapshot/ViewportSnapshotCollection';
import { WorkspaceContextCollection } from '../../../workspace/context/WorkspaceContextCollection';
import { TestIdGenerator } from '../../../../tests/TestIdGenerator';

describe('ViewportSnapshotManager.minimizeViewport', () => {
  const bounds: ProportionalBounds = { x: 0, y: 0, width: 1, height: 1 };
  const idGenerator = new TestIdGenerator('test');

  function makeContext(area: number, id: string): WorkspaceContext {
    const size = Math.sqrt(area);
    return {
      id,
      name: id,
      viewportSnapshots: new ViewportSnapshotCollection([]),
      maxScreenBounds: { x: 0, y: 0, width: size, height: size },
      orientation: 'landscape',
      aspectRatio: 1,
      sizeCategory: 'lg',
      deviceType: 'desktop',
      minimumViewportScreenHeight: 10,
      minimumViewportScreenWidth: 10,
    };
  }

  it('sets isMinimized to true and leaves bounds unchanged', () => {
    const context = makeContext(10000, 'A');
    const contextCollection = new WorkspaceContextCollection([context]);
    const manager = new ViewportSnapshotManager(contextCollection, idGenerator);
    manager.setCurrentWorkspaceContext(context);
    manager.addViewport(bounds, 'v1');
    // Precondition
    let snap = context.viewportSnapshots.getAll()[0];
    expect(snap.isMinimized).toBe(false);
    expect(snap.bounds).toBe(bounds);
    // Minimize
    const result = manager.minimizeViewport({
      id: 'v1',
      screenBounds: { x: 0, y: 0, width: 1, height: 1 },
      isMinimized: false,
      isMaximized: false,
      isDefault: false,
      isRequired: false,
    });
    expect(result).toBe(true);
    snap = context.viewportSnapshots.getAll()[0];
    expect(snap.isMinimized).toBe(true);
    expect(snap.bounds).toBe(bounds);
  });

  it('returns false if viewport is not found', () => {
    const context = makeContext(10000, 'A');
    const contextCollection = new WorkspaceContextCollection([context]);
    const manager = new ViewportSnapshotManager(contextCollection, idGenerator);
    manager.setCurrentWorkspaceContext(context);
    manager.addViewport(bounds, 'v1');
    const result = manager.minimizeViewport({
      id: 'notfound',
      screenBounds: { x: 0, y: 0, width: 1, height: 1 },
      isMinimized: false,
      isMaximized: false,
      isDefault: false,
      isRequired: false,
    });
    expect(result).toBe(false);
  });
});
