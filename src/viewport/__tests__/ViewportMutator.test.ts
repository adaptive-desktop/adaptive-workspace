import { ViewportMutator } from '../ViewportMutator';
import { MutableViewport } from '../MutableViewport';
import { ViewportSnapshotCollection } from '../snapshot/ViewportSnapshotCollection';
import { ScreenBounds } from '../../workspace/types';

describe('ViewportMutator', () => {
  let viewports: Map<string, MutableViewport>;
  let workspaceBounds: ScreenBounds;
  let mutator: ViewportMutator;

  beforeEach(() => {
    workspaceBounds = { x: 0, y: 0, width: 1000, height: 800 };
    viewports = new Map();
    mutator = new ViewportMutator(viewports);
  });

  function makeSnapshot(
    id: string,
    bounds: { x: number; y: number; width: number; height: number } = {
      x: 0,
      y: 0,
      width: 1,
      height: 1,
    },
    isDefault = false,
    isMinimized = false,
    isMaximized = false,
    isRequired = false
  ) {
    return {
      id,
      bounds,
      isDefault,
      isMaximized,
      isMinimized,
      isRequired,
      workspaceContextId: 'ctx',
      timestamp: Date.now(),
    };
  }

  it('adds new MutableViewport for new snapshot', () => {
    const snapshots = new ViewportSnapshotCollection([makeSnapshot('v1')]);
    mutator.mutateFromSnapshots(snapshots, workspaceBounds);
    expect(viewports.size).toBe(1);
    expect(viewports.get('v1')).toBeDefined();
  });

  it('removes MutableViewport not in snapshot', () => {
    const v1 = new MutableViewport({
      id: 'v1',
      proportionalBounds: { x: 0, y: 0, width: 1, height: 1 },
      isDefault: false,
      isMinimized: false,
      isMaximized: false,
      isRequired: false,
    });
    viewports.set('v1', v1);
    const snapshots = new ViewportSnapshotCollection([]);
    mutator.mutateFromSnapshots(snapshots, workspaceBounds);
    expect(viewports.size).toBe(0);
  });

  it('updates isMinimized and isMaximized', () => {
    const snapshots = new ViewportSnapshotCollection([
      makeSnapshot('v1', { x: 0, y: 0, width: 1, height: 1 }, false, true, false, false),
    ]);
    mutator.mutateFromSnapshots(snapshots, workspaceBounds);
    const v1 = viewports.get('v1');
    expect(v1?.isMinimized).toBe(true);
    expect(v1?.isMaximized).toBe(false);
  });

  it('updates isMinimized and isMaximized', () => {
    const snapshots = new ViewportSnapshotCollection([
      makeSnapshot('v1', { x: 0, y: 0, width: 1, height: 1 }, false, false, true, false),
    ]);
    mutator.mutateFromSnapshots(snapshots, workspaceBounds);
    const v1 = viewports.get('v1');
    expect(v1?.isMaximized).toBe(true);
    expect(v1?.isMinimized).toBe(false);
  });

  it('updates proportionalBounds and recalculates screenBounds', () => {
    const v1 = new MutableViewport({
      id: 'v1',
      proportionalBounds: { x: 0, y: 0, width: 0.5, height: 0.5 },
      isDefault: false,
      isMinimized: false,
      isMaximized: false,
      isRequired: false,
    });
    viewports.set('v1', v1);
    const snapshots = new ViewportSnapshotCollection([
      makeSnapshot('v1', { x: 0.1, y: 0.2, width: 0.3, height: 0.4 }),
    ]);
    mutator.mutateFromSnapshots(snapshots, workspaceBounds);
    const updated = viewports.get('v1');
    expect(updated?.proportionalBounds).toEqual({ x: 0.1, y: 0.2, width: 0.3, height: 0.4 });
    expect(updated?.screenBounds.x).toBeCloseTo(100);
    expect(updated?.screenBounds.y).toBeCloseTo(160);
    expect(updated?.screenBounds.width).toBeCloseTo(300);
    expect(updated?.screenBounds.height).toBeCloseTo(320);
  });
});
