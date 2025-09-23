import { getWorkspaceContextArea } from '../getWorkspaceContextArea';
import { WorkspaceContext } from '../../workspace/types';
import { ViewportSnapshotCollection } from '../../viewport/snapshot/ViewportSnapshotCollection';

describe('getWorkspaceContextArea', () => {
  it('returns correct area for valid screenBounds', () => {
    const ctx: WorkspaceContext = {
      id: '1',
      snapshots: new ViewportSnapshotCollection(),
      maxScreenBounds: { x: 0, y: 0, width: 100, height: 50 },
      orientation: 'landscape',
      aspectRatio: 2,
      breakpoint: 'lg',
      sizeCategory: 'large',
      deviceType: 'desktop',
      minimumViewportScreenHeight: 10,
      minimumViewportScreenWidth: 10,
      name: 'test',
    };
    expect(getWorkspaceContextArea(ctx)).toBe(5000);
  });

  it('returns 0 if width or height is 0', () => {
    const ctx: WorkspaceContext = {
      id: '3',
      snapshots: new ViewportSnapshotCollection(),
      maxScreenBounds: { x: 0, y: 0, width: 0, height: 100 },
      orientation: 'landscape',
      aspectRatio: 2,
      breakpoint: 'lg',
      sizeCategory: 'large',
      deviceType: 'desktop',
      minimumViewportScreenHeight: 10,
      minimumViewportScreenWidth: 10,
      name: 'test',
    };
    expect(getWorkspaceContextArea(ctx)).toBe(0);
  });

  it('returns correct area for floating point values', () => {
    const ctx: WorkspaceContext = {
      id: '4',
      snapshots: new ViewportSnapshotCollection(),
      maxScreenBounds: { x: 0, y: 0, width: 10.5, height: 2.5 },
      orientation: 'landscape',
      aspectRatio: 2,
      breakpoint: 'lg',
      sizeCategory: 'large',
      deviceType: 'desktop',
      minimumViewportScreenHeight: 10,
      minimumViewportScreenWidth: 10,
      name: 'test',
    };
    expect(getWorkspaceContextArea(ctx)).toBeCloseTo(26.25);
  });
});
