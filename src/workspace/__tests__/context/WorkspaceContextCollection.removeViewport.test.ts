import { WorkspaceContextCollection } from '../../context/WorkspaceContextCollection';
import { WorkspaceContext } from '../../types';
import { ViewportSnapshotCollection } from '../../../viewport/snapshot/ViewportSnapshotCollection';
import { addRemoveViewportToContext } from '../../context/WorkspaceContextImpl';

describe('WorkspaceContextCollection.removeViewport', () => {
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
    return addRemoveViewportToContext({
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
    });
  }

  it('removes a viewport snapshot from all contexts', () => {
    const c1 = makeContext('A', 'v1');
    const c2 = makeContext('B', 'v1');
    const collection = new WorkspaceContextCollection([c1, c2]);
    expect(collection.removeViewport('v1')).toBe(true);
    expect(c1.snapshots.getAll().length).toBe(0);
    expect(c2.snapshots.getAll().length).toBe(0);
  });

  it('returns false if no context removes the viewport', () => {
    const c1 = makeContext('A');
    const c2 = makeContext('B');
    const collection = new WorkspaceContextCollection([c1, c2]);
    expect(collection.removeViewport('notfound')).toBe(false);
  });
});
