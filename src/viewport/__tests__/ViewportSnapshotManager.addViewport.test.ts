import { ViewportSnapshotManager } from '../ViewportSnapshotManager';
import { WorkspaceContext } from '../../workspace/types';
import { TestIdGenerator } from '../../shared/TestIdGenerator';
import { ProportionalBounds } from '../../workspace/types';

describe('ViewportSnapshotManager.addViewport', () => {
  const bounds: ProportionalBounds = { x: 0, y: 0, width: 1, height: 1 };
  const idGen = new TestIdGenerator('test');

  function makeContext(area: number, id: string): WorkspaceContext {
    const size = Math.sqrt(area);
    return {
      id,
      name: id,
      viewportState: { viewportSnapshots: [] },
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

  it('adds a snapshot when there are no previous snapshots', () => {
    const ctx = makeContext(10000, 'A');
    const mgr = new ViewportSnapshotManager([ctx], idGen);
    mgr.setCurrentWorkspaceContext(ctx);
    const snap = mgr.addViewport(bounds);
    expect(ctx.viewportState.viewportSnapshots.length).toBe(1);
    expect(snap.isMinimized).toBe(false);
    expect(snap.bounds).toBe(bounds);
  });

  it('sets isMinimized and bounds correctly for smaller/larger contexts', () => {
    const large = makeContext(10000, 'L');
    const small = makeContext(100, 'S');
    const mgr = new ViewportSnapshotManager([large, small], idGen);
    mgr.setCurrentWorkspaceContext(large);
    const snap = mgr.addViewport(bounds);
    // Large context: not minimized
    const largeSnap = large.viewportState.viewportSnapshots[0];
    expect(largeSnap.isMinimized).toBe(false);
    expect(largeSnap.bounds).toBe(bounds);
    // Small context: minimized, no bounds
    const smallSnap = small.viewportState.viewportSnapshots[0];
    expect(smallSnap.isMinimized).toBe(true);
    expect(smallSnap.bounds).toBeUndefined();
  });

  it('sets isMinimized and bounds correctly when current context is smaller', () => {
    const large = makeContext(10000, 'L');
    const small = makeContext(100, 'S');
    const mgr = new ViewportSnapshotManager([large, small], idGen);
    mgr.setCurrentWorkspaceContext(small);
    const snap = mgr.addViewport(bounds);
    // Small context: not minimized
    const smallSnap = small.viewportState.viewportSnapshots[0];
    expect(smallSnap.isMinimized).toBe(false);
    expect(smallSnap.bounds).toBe(bounds);
    // Large context: not minimized (since area is not smaller than itself)
    const largeSnap = large.viewportState.viewportSnapshots[0];
    expect(largeSnap.isMinimized).toBe(false);
    expect(largeSnap.bounds).toBe(bounds);
  });
});
