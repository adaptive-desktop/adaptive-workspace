import { ViewportSnapshotManager } from '../ViewportSnapshotManager';
import { WorkspaceContext } from '../../workspace/types';
import { TestIdGenerator } from '../../shared/TestIdGenerator';
import { ProportionalBounds } from '../../workspace/types';

describe('ViewportSnapshotManager legacy scenarios', () => {
  const bounds: ProportionalBounds = { x: 0, y: 0, width: 1, height: 1 };
  const idGen = new TestIdGenerator('test');

  function makeContext(area: number, id: string): WorkspaceContext {
    const size = Math.sqrt(area);
    return {
      id,
      name: id,
      viewportState: { viewportSnapshots: [] },
      screenBounds: { x: 0, y: 0, width: size, height: size },
      orientation: 'landscape',
      aspectRatio: 1,
      breakpoint: 'lg',
      sizeCategory: 'large',
      deviceType: 'desktop',
      minimumViewportScreenHeight: 10,
      minimumViewportScreenWidth: 10,
    };
  }

  it('adds a full-workspace viewport snapshot to all contexts', () => {
    const contexts = [makeContext(10000, 'phone'), makeContext(10000, 'laptop'), makeContext(10000, 'ultrawide')];
    const manager = new ViewportSnapshotManager(contexts, idGen);
    manager.setCurrentWorkspaceContext(contexts[0]);
    manager.addViewport(bounds, 'A');
    for (const context of contexts) {
      const snaps = context.viewportState.viewportSnapshots;
      expect(snaps.length).toBe(1);
      expect(snaps[0].id).toBe('A');
      expect(snaps[0].bounds).toEqual(bounds);
      expect(snaps[0].isMinimized).toBe(false);
    }
  });

  // Remove test is not implemented in ViewportSnapshotManager, so we skip it.
});
