import { LayoutSnapshotService } from '../LayoutSnapshotService';
import { WorkspaceContext } from '../../workspace/types';

describe('LayoutSnapshotService', () => {
    const baseContext: WorkspaceContext = {
        id: 'test-context',
        name: 'Test Context',
        orientation: 'landscape',
        aspectRatio: 1.6,
        breakpoint: 'md',
        sizeCategory: 'medium',
        deviceType: 'standard-laptop',
        screenBounds: { x: 0, y: 0, width: 1200, height: 800 },
        viewportStates: [
          { viewportId: 'vp-1', bounds: { x: 0, y: 0, width: 0.5, height: 1 }, isMinimized: false },
          { viewportId: 'vp-2', bounds: { x: 0.5, y: 0, width: 0.5, height: 1 }, isMinimized: false },
        ],
    };

  it('creates a deep snapshot of WorkspaceContext', () => {
    const snapshot = LayoutSnapshotService.createSnapshot(baseContext);
    expect(snapshot).not.toBe(baseContext);
    expect((snapshot as WorkspaceContext).viewportStates).not.toBe(baseContext.viewportStates);
    expect(JSON.stringify(snapshot)).toEqual(JSON.stringify(baseContext));
  });

  it('restores a WorkspaceContext from a snapshot', () => {
    const snapshot = LayoutSnapshotService.createSnapshot(baseContext);
    const restored = LayoutSnapshotService.restoreFromSnapshot(snapshot);
    expect(restored).not.toBe(baseContext);
    expect(restored.viewportStates).not.toBe(baseContext.viewportStates);
    expect(restored).toEqual(baseContext);
  });

  it('modifying the original context after snapshot does not affect the snapshot', () => {
    const snapshot = LayoutSnapshotService.createSnapshot(baseContext);
  baseContext.viewportStates[0].bounds!.width = 0.25;
  expect((snapshot as WorkspaceContext).viewportStates?.[0].bounds?.width).toBe(0.5);
  });
});
