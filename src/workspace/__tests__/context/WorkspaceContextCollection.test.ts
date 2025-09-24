import { WorkspaceContextCollection } from '../../context/WorkspaceContextCollection';
import { WorkspaceContext } from '../../types';
import { ViewportSnapshotCollection } from '../../../viewport/snapshot/ViewportSnapshotCollection';

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
      maxScreenBounds: { x: 0, y: 0, width: 100, height: 100 },
      orientation: 'landscape',
      aspectRatio: 1,
      sizeCategory: 'lg',
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
    const ctx = makeContext('A');
    c.addContext(ctx);
    expect(c.removeContext(ctx)).toBe(true);
    expect(c.getAll()).toHaveLength(0);
    // Try to remove again
    expect(c.removeContext(ctx)).toBe(false);
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

  describe('findByOrientation', () => {
    const createMockContext = (
      id: string,
      orientation: 'landscape' | 'portrait'
    ): WorkspaceContext => ({
      id,
      name: `Context ${id}`,
      maxScreenBounds: { x: 0, y: 0, width: 1000, height: 800 },
      orientation,
      aspectRatio: orientation === 'landscape' ? 16 / 9 : 9 / 16,
      sizeCategory: 'md',
      deviceType: 'desktop',
      minimumViewportScreenHeight: 200,
      minimumViewportScreenWidth: 300,
      snapshots: new ViewportSnapshotCollection(),
    });

    // Test contexts
    const landscapeContext1 = createMockContext('landscape-1', 'landscape');
    const landscapeContext2 = createMockContext('landscape-2', 'landscape');
    const portraitContext1 = createMockContext('portrait-1', 'portrait');
    const portraitContext2 = createMockContext('portrait-2', 'portrait');

    it('should return empty array when no contexts match the orientation', () => {
      // Create collection with only landscape contexts
      const collection = new WorkspaceContextCollection([landscapeContext1, landscapeContext2]);

      // Search for portrait contexts
      const result = collection.findByOrientation('portrait');

      // Should return empty array
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should return all contexts matching the specified orientation', () => {
      // Create collection with mixed orientations
      const collection = new WorkspaceContextCollection([
        landscapeContext1,
        portraitContext1,
        landscapeContext2,
        portraitContext2,
      ]);

      // Search for landscape contexts
      const landscapeResults = collection.findByOrientation('landscape');

      // Should return both landscape contexts
      expect(landscapeResults.length).toBe(2);
      expect(landscapeResults).toContainEqual(expect.objectContaining({ id: 'landscape-1' }));
      expect(landscapeResults).toContainEqual(expect.objectContaining({ id: 'landscape-2' }));

      // Search for portrait contexts
      const portraitResults = collection.findByOrientation('portrait');

      // Should return both portrait contexts
      expect(portraitResults.length).toBe(2);
      expect(portraitResults).toContainEqual(expect.objectContaining({ id: 'portrait-1' }));
      expect(portraitResults).toContainEqual(expect.objectContaining({ id: 'portrait-2' }));
    });

    it('should return empty array when collection is empty', () => {
      // Create empty collection
      const collection = new WorkspaceContextCollection();

      // Search for any orientation
      const result = collection.findByOrientation('landscape');

      // Should return empty array
      expect(result).toEqual([]);
      expect(result.length).toBe(0);
    });

    it('should handle case-sensitive orientation matching', () => {
      // Create collection with proper casing
      const collection = new WorkspaceContextCollection([landscapeContext1, portraitContext1]);

      // Search with incorrect casing
      const landscapeResults = collection.findByOrientation('LANDSCAPE');
      const portraitResults = collection.findByOrientation('Portrait');

      // Should not match due to case sensitivity
      expect(landscapeResults.length).toBe(0);
      expect(portraitResults.length).toBe(0);
    });

    it('should return contexts in the same order they were added', () => {
      // Create collection with specific order
      const collection = new WorkspaceContextCollection([
        landscapeContext2, // Added first
        landscapeContext1, // Added second
      ]);

      // Search for landscape contexts
      const results = collection.findByOrientation('landscape');

      // Should maintain insertion order (Map preserves insertion order)
      expect(results[0].id).toBe('landscape-2');
      expect(results[1].id).toBe('landscape-1');
    });
  });
});
