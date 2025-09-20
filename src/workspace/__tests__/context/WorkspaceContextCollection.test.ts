import { WorkspaceContextCollection } from '../../context/WorkspaceContextCollection';
import { WorkspaceContext } from '../../types';
import { ViewportSnapshotCollection } from '../../../viewport/ViewportSnapshotCollection';

describe('WorkspaceContextCollection', () => {
  function makeContext(id: string, snapId?: string): WorkspaceContext {
    const snapshots = new ViewportSnapshotCollection();
    if (snapId) {
      snapshots.add({
        id: snapId,
        isDefault: false,
        isMaximized: false,
        isMinimized: false,
        isRequired: false,
        workspaceContextId: id,
        timestamp: 1,
      });
    }
    return {
      id,
      name: id,
      snapshots,
      screenBounds: { x: 0, y: 0, width: 100, height: 100 },
      orientation: 'landscape',
      aspectRatio: 1,
      breakpoint: 'lg',
      sizeCategory: 'large',
      deviceType: 'desktop',
      minimumViewportScreenHeight: 10,
      minimumViewportScreenWidth: 10,
    };
  }

  it('adds and retrieves contexts', () => {
    const c = new WorkspaceContextCollection();
    const ctx = makeContext('A');
    c.addContext(ctx);
    expect(c.getAll()).toHaveLength(1);
    expect(c.getAll()[0].id).toBe('A');
  });

  it('removes a context by id', () => {
    const c = new WorkspaceContextCollection();
    c.addContext(makeContext('A'));
    expect(c.removeContext('A')).toBe(true);
    expect(c.getAll()).toHaveLength(0);
    expect(c.removeContext('A')).toBe(false);
  });

  it('updates a viewport snapshot in all contexts', () => {
    const c = new WorkspaceContextCollection();
    c.addContext(makeContext('A', 'v1'));
    c.addContext(makeContext('B', 'v1'));
    const updated = c.updateViewport({ id: 'v1', isMinimized: true });
    expect(updated).toBe(true);
    for (const ctx of c.getAll()) {
      expect(ctx.snapshots.findById('v1')?.isMinimized).toBe(true);
    }
  });

  it('returns false if no viewport snapshot is updated', () => {
    const c = new WorkspaceContextCollection();
    c.addContext(makeContext('A', 'v1'));
    expect(c.updateViewport({ id: 'notfound', isMinimized: true })).toBe(false);
  });
});
