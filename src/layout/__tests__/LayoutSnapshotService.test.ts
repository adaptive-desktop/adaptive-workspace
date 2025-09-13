import { LayoutSnapshotService } from '../LayoutSnapshotService';
import { LayoutContext } from '../types';

describe('LayoutSnapshotService', () => {
  const baseContext: LayoutContext = {
    orientation: 'landscape',
    aspectRatio: 1.6,
    breakpoint: 'md',
    sizeCategory: 'medium',
    deviceType: 'standard-laptop',
    screenBounds: { x: 0, y: 0, width: 1200, height: 800 },
    viewports: [
      { id: 'vp-1', bounds: { x: 0, y: 0, width: 0.5, height: 1 } },
      { id: 'vp-2', bounds: { x: 0.5, y: 0, width: 0.5, height: 1 } },
    ],
  };

  it('creates a deep snapshot of LayoutContext', () => {
    const snapshot = LayoutSnapshotService.createSnapshot(baseContext);
    expect(snapshot).not.toBe(baseContext);
    expect((snapshot as LayoutContext).viewports).not.toBe(baseContext.viewports);
    expect(JSON.stringify(snapshot)).toEqual(JSON.stringify(baseContext));
  });

  it('restores a LayoutContext from a snapshot', () => {
    const snapshot = LayoutSnapshotService.createSnapshot(baseContext);
    const restored = LayoutSnapshotService.restoreFromSnapshot(snapshot);
    expect(restored).not.toBe(baseContext);
    expect(restored.viewports).not.toBe(baseContext.viewports);
    expect(restored).toEqual(baseContext);
  });

  it('modifying the original context after snapshot does not affect the snapshot', () => {
    const snapshot = LayoutSnapshotService.createSnapshot(baseContext);
    baseContext.viewports[0].bounds.width = 0.25;
    expect((snapshot as LayoutContext).viewports[0].bounds.width).toBe(0.5);
  });
});
