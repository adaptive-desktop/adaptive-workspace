import { ViewportSnapshotManager } from '../../snapshot/ViewportSnapshotManager';
import { WorkspaceContext } from '../../../workspace/types';
import { TestIdGenerator } from '../../../shared/TestIdGenerator';
import { ProportionalBounds } from '../../../workspace/types';
import { ViewportSnapshotCollection } from '../../snapshot/ViewportSnapshotCollection';

describe('ViewportSnapshotManager.minimizeViewport', () => {
  const bounds: ProportionalBounds = { x: 0, y: 0, width: 1, height: 1 };
  const idGen = new TestIdGenerator('test');

  function makeContext(area: number, id: string): WorkspaceContext {
    const size = Math.sqrt(area);
    return {
      id,
      name: id,
      snapshots: new ViewportSnapshotCollection([]),
      screenBounds: { x: 0, y: 0, width: size, height: size },
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
    const ctx = makeContext(10000, 'A');
    const mgr = new ViewportSnapshotManager([ctx], idGen);
    mgr.setCurrentWorkspaceContext(ctx);
    mgr.addViewport(bounds, 'v1');
    // Precondition
    let snap = ctx.snapshots.getAll()[0];
    expect(snap.isMinimized).toBe(false);
    expect(snap.bounds).toBe(bounds);
    // Minimize
    const result = mgr.minimizeViewport({
      id: 'v1',
      screenBounds: { x: 0, y: 0, width: 1, height: 1 },
      isMinimized: false,
      isMaximized: false,
      isDefault: false,
      isRequired: false,
    });
    expect(result).toBe(true);
    snap = ctx.snapshots.getAll()[0];
    expect(snap.isMinimized).toBe(true);
    expect(snap.bounds).toBe(bounds);
  });

  it('returns false if viewport is not found', () => {
    const ctx = makeContext(10000, 'A');
    const mgr = new ViewportSnapshotManager([ctx], idGen);
    mgr.setCurrentWorkspaceContext(ctx);
    mgr.addViewport(bounds, 'v1');
    const result = mgr.minimizeViewport({
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
