import { ViewportSnapshotManager } from '../../snapshot/ViewportSnapshotManager';
import { TestIdGenerator } from '../../../shared/TestIdGenerator';
import { ProportionalBounds, WorkspaceContext } from '../../../workspace/types';

describe('ViewportSnapshotManager.maximizeViewport', () => {
  let manager: ViewportSnapshotManager;
  let context: WorkspaceContext;
  let idGenerator: TestIdGenerator;
  let bounds: ProportionalBounds;

  beforeEach(() => {
    bounds = { x: 0, y: 0, width: 1, height: 1 };
    idGenerator = new TestIdGenerator('v');
    context = {
      id: 'ctx1',
      screenBounds: bounds,
      orientation: 'landscape',
      aspectRatio: 1,
      breakpoint: 'md',
      sizeCategory: 'medium',
      deviceType: 'desktop',
      minimumViewportScreenHeight: 0,
      minimumViewportScreenWidth: 0,
      snapshots: {
        add: jest.fn(),
        update: jest.fn(() => true),
        remove: jest.fn(),
        getAll: jest.fn(() => []),
      },
    };
    manager = new ViewportSnapshotManager([context], idGenerator);
    manager.setCurrentWorkspaceContext(context);
  });

  it('should set isMaximized true and isMinimized false for the viewport', () => {
    const viewport = {
      id: 'v1',
      screenBounds: bounds,
      isMinimized: false,
      isMaximized: false,
    };
    const spy = jest.spyOn(context.snapshots, 'update');
    manager.maximizeViewport(viewport);
    expect(spy).toHaveBeenCalledWith({ id: 'v1', isMaximized: true, isMinimized: false });
  });

  it('should return true if updateViewport returns true', () => {
    const viewport = {
      id: 'v1',
      screenBounds: bounds,
      isMinimized: false,
      isMaximized: false,
    };
    expect(manager.maximizeViewport(viewport)).toBe(true);
  });

  it('should return false if updateViewport returns false', () => {
    jest.spyOn(context.snapshots, 'update').mockReturnValue(false);
    const viewport = {
      id: 'v1',
      screenBounds: bounds,
      isMinimized: false,
      isMaximized: false,
    };
    expect(manager.maximizeViewport(viewport)).toBe(false);
  });
});
