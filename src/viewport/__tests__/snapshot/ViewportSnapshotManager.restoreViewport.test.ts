import { ViewportSnapshotManager } from '../../snapshot/ViewportSnapshotManager';
import { ViewportSnapshotCollection } from '../../snapshot/ViewportSnapshotCollection';
import { WorkspaceContext } from '../../../workspace/types';
import { ProportionalBounds } from '../../../workspace/types';
import { WorkspaceContextCollection } from '../../../workspace/context/WorkspaceContextCollection';
import { TestIdGenerator } from '../../../../tests/TestIdGenerator';

describe('ViewportSnapshotManager.restoreViewport', () => {
  let manager: ViewportSnapshotManager;
  let context: WorkspaceContext;
  let idGenerator: TestIdGenerator;
  let bounds: ProportionalBounds;

  beforeEach(() => {
    bounds = { x: 0, y: 0, width: 1, height: 1 };
    idGenerator = new TestIdGenerator('v');
    const viewportSnapshots = new ViewportSnapshotCollection();
    jest.spyOn(viewportSnapshots, 'add').mockImplementation(jest.fn());
    jest.spyOn(viewportSnapshots, 'update').mockImplementation(() => true);
    jest.spyOn(viewportSnapshots, 'remove').mockImplementation(jest.fn());
    jest.spyOn(viewportSnapshots, 'getAll').mockImplementation(() => []);
    context = {
      id: 'ctx1',
      maxScreenBounds: bounds,
      orientation: 'landscape',
      aspectRatio: 1,
      sizeCategory: 'md',
      deviceType: 'desktop',
      minimumViewportScreenHeight: 0,
      minimumViewportScreenWidth: 0,
      viewportSnapshots,
    };
    const contextCollection = new WorkspaceContextCollection([context]);
    manager = new ViewportSnapshotManager(contextCollection, idGenerator);
    manager.setCurrentWorkspaceContext(context);
  });

  it('should set isMinimized and isMaximized to false for the viewport', () => {
    const viewport = {
      id: 'v1',
      screenBounds: bounds,
      isMinimized: true,
      isMaximized: true,
      isDefault: false,
      isRequired: false,
    };
    const spy = jest.spyOn(context.viewportSnapshots, 'update');
    manager.restoreViewport(viewport);
    expect(spy).toHaveBeenCalledWith({ id: 'v1', isMinimized: false, isMaximized: false });
  });

  it('should return true if updateViewport returns true', () => {
    const viewport = {
      id: 'v1',
      screenBounds: bounds,
      isMinimized: true,
      isMaximized: true,
      isDefault: false,
      isRequired: false,
    };
    expect(manager.restoreViewport(viewport)).toBe(true);
  });

  it('should return false if updateViewport returns false', () => {
    jest.spyOn(context.viewportSnapshots, 'update').mockReturnValue(false);
    const viewport = {
      id: 'v1',
      screenBounds: bounds,
      isMinimized: true,
      isMaximized: true,
      isDefault: false,
      isRequired: false,
    };
    expect(manager.restoreViewport(viewport)).toBe(false);
  });
});
