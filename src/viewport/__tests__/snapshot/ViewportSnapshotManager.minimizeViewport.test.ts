import { ViewportSnapshotManager } from '../../snapshot/ViewportSnapshotManager';
import { WorkspaceContext } from '../../../workspace/types';
import { TestIdGenerator } from '../../../shared/TestIdGenerator';
import { ProportionalBounds } from '../../../workspace/types';
import { ViewportSnapshotCollection } from '../../snapshot/ViewportSnapshotCollection';
import { WorkspaceContextCollection } from '../../../workspace/context/WorkspaceContextCollection';

describe('ViewportSnapshotManager.minimizeViewport', () => {
  const bounds: ProportionalBounds = { x: 0, y: 0, width: 1, height: 1 };
  const idGenerator = new TestIdGenerator('test');

  function makeContext(area: number, id: string): WorkspaceContext {
    const size = Math.sqrt(area);
    return {
      id,
      name: id,
      snapshots: new ViewportSnapshotCollection([]),
      maxScreenBounds: { x: 0, y: 0, width: size, height: size },
      orientation: 'landscape',
      aspectRatio: 1,
      breakpoint: 'lg',
      sizeCategory: 'large',
      deviceType: 'desktop',
      minimumViewportScreenHeight: 10,
      minimumViewportScreenWidth: 10,
    };
  }

  it('sets isMinimized to true and leaves bounds unchanged', () => {
    const contex = makeContext(10000, 'A');
    const contextCollection = new WorkspaceContextCollection([contex]);
    const manager = new ViewportSnapshotManager(contextCollection, idGenerator);
    manager.setCurrentWorkspaceContext(contex);
    manager.addViewport(bounds, 'v1');
    // Precondition
    let snap = contex.snapshots.getAll()[0];
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
    snap = contex.snapshots.getAll()[0];
    expect(snap.isMinimized).toBe(true);
    expect(snap.bounds).toBe(bounds);
  });

  it('returns false if viewport is not found', () => {
    const contex = makeContext(10000, 'A');
    const contextCollection = new WorkspaceContextCollection([contex]);
    const manager = new ViewportSnapshotManager(contextCollection, idGenerator);
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
