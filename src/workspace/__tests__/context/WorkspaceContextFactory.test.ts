import { WorkspaceContextFactory } from '../../context/WorkspaceContextFactory';
import { WorkspaceContextSnapshot } from '../../types';
import { ViewportSnapshotCollection } from '../../../viewport/snapshot/ViewportSnapshotCollection';

describe('WorkspaceContextFactory', () => {
  test('should create a new WorkspaceContext with all properties copied from the snapshot', () => {
    const factory = new WorkspaceContextFactory();
    const mockSnapshot: WorkspaceContextSnapshot = {
      id: 'test-context-id',
      name: 'Test Context',
      maxScreenBounds: { x: 0, y: 0, width: 1440, height: 900 },
      viewportSnapshots: [],
      orientation: 'landscape',
      aspectRatio: 16 / 9,
      sizeCategory: 'md',
      deviceType: 'standard-laptop',
      minimumViewportScreenHeight: 300,
      minimumViewportScreenWidth: 400,
    };

    const result = factory.fromSnapshot(mockSnapshot);

    expect(result).toBeDefined();
    expect(result.id).toBe('test-context-id');
    expect(result.name).toBe('Test Context');
    expect(result.maxScreenBounds).toEqual({ x: 0, y: 0, width: 1440, height: 900 });
    expect(result.orientation).toBe('landscape');
    expect(result.aspectRatio).toBe(16 / 9);
    expect(result.sizeCategory).toBe('md');
    expect(result.deviceType).toBe('standard-laptop');
    expect(result.minimumViewportScreenHeight).toBe(300);
    expect(result.minimumViewportScreenWidth).toBe(400);
    expect(result.viewportSnapshots).toBeInstanceOf(ViewportSnapshotCollection);
  });

  test('should correctly transfer all viewport snapshots from the snapshot to the new context', () => {
    const factory = new WorkspaceContextFactory();

    // Create mock viewport snapshots
    const viewportSnapshots = [
      {
        id: 'viewport-1',
        workspaceContextId: 'test-context-id',
        isDefault: false,
        isMaximized: false,
        isMinimized: false,
        isRequired: false,
        timestamp: Date.now(),
        bounds: { x: 0, y: 0, width: 500, height: 400 },
      },
      {
        id: 'viewport-2',
        workspaceContextId: 'test-context-id',
        isDefault: true,
        isMaximized: false,
        isMinimized: false,
        isRequired: true,
        timestamp: Date.now(),
        bounds: { x: 500, y: 0, width: 500, height: 400 },
      },
    ];

    const mockSnapshot: WorkspaceContextSnapshot = {
      id: 'test-context-id',
      name: 'Test Context',
      maxScreenBounds: { x: 0, y: 0, width: 1440, height: 900 },
      viewportSnapshots,
      orientation: 'landscape',
      aspectRatio: 16 / 9,
      sizeCategory: 'md',
      deviceType: 'standard-laptop',
      minimumViewportScreenHeight: 300,
      minimumViewportScreenWidth: 400,
    };

    // Spy on ViewportSnapshotCollection's add method
    const addSpy = jest.spyOn(ViewportSnapshotCollection.prototype, 'add');

    factory.fromSnapshot(mockSnapshot);

    // Verify snapshots were added to the collection
    expect(addSpy).toHaveBeenCalledTimes(2);
    expect(addSpy).toHaveBeenNthCalledWith(1, viewportSnapshots[0]);
    expect(addSpy).toHaveBeenNthCalledWith(2, viewportSnapshots[1]);

    // Restore the spy
    addSpy.mockRestore();
  });

  test('should handle an empty array of snapshots properly', () => {
    const factory = new WorkspaceContextFactory();
    const mockSnapshot: WorkspaceContextSnapshot = {
      id: 'empty-context-id',
      name: 'Empty Context',
      maxScreenBounds: { x: 0, y: 0, width: 1440, height: 900 },
      viewportSnapshots: [],
      orientation: 'landscape',
      aspectRatio: 16 / 9,
      sizeCategory: 'md',
      deviceType: 'standard-laptop',
      minimumViewportScreenHeight: 300,
      minimumViewportScreenWidth: 400,
    };

    // Spy on ViewportSnapshotCollection's add method
    const addSpy = jest.spyOn(ViewportSnapshotCollection.prototype, 'add');

    const result = factory.fromSnapshot(mockSnapshot);

    // Verify snapshots collection was created but no snapshots were added
    expect(result.viewportSnapshots).toBeInstanceOf(ViewportSnapshotCollection);
    expect(addSpy).not.toHaveBeenCalled();

    // Restore the spy
    addSpy.mockRestore();
  });
});
