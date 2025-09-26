import { WorkspaceContextCollection } from '../../context/WorkspaceContextCollection';
import { WorkspaceContext } from '../../types';
import { ViewportSnapshotCollection } from '../../../viewport/snapshot/ViewportSnapshotCollection';

describe('WorkspaceContextCollection.removeViewport', () => {
  function makeContext(id: string, snapshotId?: string): WorkspaceContext {
    const viewportSnapshots = new ViewportSnapshotCollection();
    if (snapshotId) {
      viewportSnapshots.add({
        id: snapshotId,
        isDefault: false,
        isMaximized: false,
        isMinimized: false,
        isRequired: false,
        timestamp: 1,
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

  it('removes a viewport snapshot from all contexts', () => {
    const contextA = makeContext('A', 'v1');
    const contextB = makeContext('B', 'v1');
    const collection = new WorkspaceContextCollection([contextA, contextB]);
    // Create a snapshot object to remove
    const snapshot = {
      id: 'v1',
      isDefault: false,
      isMaximized: false,
      isMinimized: false,
      isRequired: false,
      timestamp: 1,
    };
    expect(collection.removeViewport(snapshot)).toBe(true);
    expect(contextA.viewportSnapshots.getAll().length).toBe(0);
    expect(contextB.viewportSnapshots.getAll().length).toBe(0);
  });

  it('returns false if no context removes the viewport', () => {
    const contextA = makeContext('A');
    const contextB = makeContext('B');
    const collection = new WorkspaceContextCollection([contextA, contextB]);
    // Try to remove a snapshot that doesn't exist
    const fakeSnapshot = {
      id: 'notfound',
      isDefault: false,
      isMaximized: false,
      isMinimized: false,
      isRequired: false,
      timestamp: 1,
    };
    expect(collection.removeViewport(fakeSnapshot)).toBe(false);
  });
});
