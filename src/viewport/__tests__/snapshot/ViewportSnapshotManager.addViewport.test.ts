import { ViewportSnapshotManager } from '../../snapshot/ViewportSnapshotManager';
import { WorkspaceContext } from '../../../workspace/types';
import { TestIdGenerator } from '../../../shared/TestIdGenerator';
import { ProportionalBounds } from '../../../workspace/types';
import { ViewportSnapshotCollection } from '../../snapshot/ViewportSnapshotCollection';
import { WorkspaceContextCollection } from '../../../workspace/context/WorkspaceContextCollection';

describe('ViewportSnapshotManager.addViewport', () => {
  const bounds: ProportionalBounds = { x: 0, y: 0, width: 1, height: 1 };
  const idGen = new TestIdGenerator('test');

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

  it('adds a snapshot when there are no previous snapshots', () => {
    const context = makeContext(10000, 'A');
    const contextCollection = new WorkspaceContextCollection([context]);
    const manager = new ViewportSnapshotManager(contextCollection, idGen);
    manager.setCurrentWorkspaceContext(context);
    manager.addViewport(bounds);
    const all = context.snapshots.getAll();
    expect(all.length).toBe(1);
    expect(all[0].isMinimized).toBe(false);
    expect(all[0].bounds).toBe(bounds);
  });

  it('sets isMinimized and bounds correctly for smaller/larger contexts', () => {
    const large = makeContext(10000, 'L');
    const small = makeContext(100, 'S');
    const contextCollection = new WorkspaceContextCollection([large, small]);
    const manager = new ViewportSnapshotManager(contextCollection, idGen);
    manager.setCurrentWorkspaceContext(large);
    manager.addViewport(bounds);
    // Large context: not minimized
    const largeSnap = large.snapshots.getAll()[0];
    expect(largeSnap.isMinimized).toBe(false);
    expect(largeSnap.bounds).toBe(bounds);
    // Small context: minimized, no bounds
    const smallSnap = small.snapshots.getAll()[0];
    expect(smallSnap.isMinimized).toBe(true);
    expect(smallSnap.bounds).toBeUndefined();
  });

  it('sets isMinimized and bounds correctly when current context is smaller', () => {
    const large = makeContext(10000, 'L');
    const small = makeContext(100, 'S');
    const contextCollection = new WorkspaceContextCollection([large, small]);
    const manager = new ViewportSnapshotManager(contextCollection, idGen);
    manager.setCurrentWorkspaceContext(small);
    manager.addViewport(bounds);
    // Small context: not minimized
    const smallSnap = small.snapshots.getAll()[0];
    expect(smallSnap.isMinimized).toBe(false);
    expect(smallSnap.bounds).toBe(bounds);
    // Large context: not minimized (since area is not smaller than itself)
    const largeSnap = large.snapshots.getAll()[0];
    expect(largeSnap.isMinimized).toBe(false);
    expect(largeSnap.bounds).toBe(bounds);
  });
});
