import { ViewportSnapshot } from '../../types';
import { ViewportSnapshotCollection } from '../../snapshot/ViewportSnapshotCollection';

describe('ViewportSnapshotCollection', () => {
  const fixedTimestamp = 1234567890;
  beforeAll(() => {
    jest.spyOn(Date, 'now').mockReturnValue(fixedTimestamp);
  });
  afterAll(() => {
    jest.spyOn(Date, 'now').mockRestore && jest.spyOn(Date, 'now').mockRestore();
  });
  it('adds and retrieves snapshots', () => {
    const c = new ViewportSnapshotCollection();
    const snap: ViewportSnapshot = {
      id: 'v1',
      isDefault: false,
      isMaximized: false,
      isMinimized: false,
      isRequired: false,
      workspaceContextId: 'ctx1',
      timestamp: fixedTimestamp,
    };
    c.add(snap);
    expect(c.getAll()).toHaveLength(1);
    expect(c.findById('v1')).toEqual(snap);
  });

  it('updates a snapshot by id', () => {
    const c = new ViewportSnapshotCollection();
    c.add({
      id: 'v1',
      isDefault: false,
      isMaximized: false,
      isMinimized: false,
      isRequired: false,
      workspaceContextId: 'ctx1',
      timestamp: 1,
    });
    const updated = c.update({ id: 'v1', isMinimized: true });
    expect(updated).toBe(true);
    expect(c.findById('v1')?.isMinimized).toBe(true);
  });

  it('removes a snapshot by id', () => {
    const c = new ViewportSnapshotCollection();
    c.add({
      id: 'v1',
      isDefault: false,
      isMaximized: false,
      isMinimized: false,
      isRequired: false,
      workspaceContextId: 'ctx1',
      timestamp: 1,
    });
    expect(c.remove('v1')).toBe(true);
    expect(c.getAll()).toHaveLength(0);
  });

  it('returns false when updating or removing non-existent id', () => {
    const c = new ViewportSnapshotCollection();
    expect(c.update({ id: 'nope', isMinimized: true })).toBe(false);
    expect(c.remove('nope')).toBe(false);
  });
});
