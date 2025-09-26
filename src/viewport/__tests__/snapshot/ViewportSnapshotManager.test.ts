import { ViewportSnapshotManager } from '../../snapshot/ViewportSnapshotManager';
import { WorkspaceContext } from '../../../workspace/types';
import { ProportionalBounds } from '../../../workspace/types';
import { ViewportSnapshotCollection } from '../../snapshot/ViewportSnapshotCollection';
import { WorkspaceContextCollection } from '../../../workspace/context/WorkspaceContextCollection';
import { TestIdGenerator } from '../../../../tests/TestIdGenerator';

describe('ViewportSnapshotManager legacy scenarios', () => {
  const bounds: ProportionalBounds = { x: 0, y: 0, width: 1, height: 1 };
  const idGen = new TestIdGenerator('test');

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

  it('adds a full-workspace viewport snapshot to all contexts', () => {
    const contexts = [
      makeContext(10000, 'phone'),
      makeContext(10000, 'laptop'),
      makeContext(10000, 'ultrawide'),
    ];
    const contextCollection = new WorkspaceContextCollection(contexts);
    const manager = new ViewportSnapshotManager(contextCollection, idGen);
    manager.setCurrentWorkspaceContext(contexts[0]);
    manager.addViewport(bounds, 'A');
    for (const context of contexts) {
      const snaps = context.viewportSnapshots.getAll();
      expect(snaps.length).toBe(1);
      expect(snaps[0].id).toBe('A');
      expect(snaps[0].bounds).toEqual(bounds);
      expect(snaps[0].isMinimized).toBe(false);
    }
  });
});

describe('ViewportSnapshotManager.getSnapshotsForContext', () => {
  const idGen = new TestIdGenerator('snap');

  function makeContextWithSnapshots(id: string, snapIds: string[]): WorkspaceContext {
    const viewportSnapshots = new ViewportSnapshotCollection();
    for (const snapId of snapIds) {
      viewportSnapshots.add({
        id: snapId,
        isDefault: false,
        isMaximized: false,
        isMinimized: false,
        isRequired: false,
        timestamp: Date.now(),
      });
    }
    return {
      id,
      name: id,
      viewportSnapshots,
      maxScreenBounds: { x: 0, y: 0, width: 100, height: 100 },
      orientation: 'landscape',
      aspectRatio: 1,
      sizeCategory: 'lg',
      deviceType: 'desktop',
      minimumViewportScreenHeight: 10,
      minimumViewportScreenWidth: 10,
    };
  }

  it('returns all snapshots for the given context', () => {
    const ctxA = makeContextWithSnapshots('A', ['snap1', 'snap2']);
    const ctxB = makeContextWithSnapshots('B', ['snap3']);
    const collection = new WorkspaceContextCollection([ctxA, ctxB]);
    const manager = new ViewportSnapshotManager(collection, idGen);
    const snapsA = manager.getSnapshotsForContext('A');
    expect(snapsA.map((s) => s.id)).toEqual(['snap1', 'snap2']);
    const snapsB = manager.getSnapshotsForContext('B');
    expect(snapsB.map((s) => s.id)).toEqual(['snap3']);
  });

  it('returns an empty array if the context has no snapshots', () => {
    const ctxA = makeContextWithSnapshots('A', []);
    const collection = new WorkspaceContextCollection([ctxA]);
    const manager = new ViewportSnapshotManager(collection, idGen);
    expect(manager.getSnapshotsForContext('A')).toEqual([]);
  });

  it('returns an empty array if the context does not exist', () => {
    const ctxA = makeContextWithSnapshots('A', ['snap1']);
    const collection = new WorkspaceContextCollection([ctxA]);
    const manager = new ViewportSnapshotManager(collection, idGen);
    expect(manager.getSnapshotsForContext('B')).toEqual([]);
  });
});
