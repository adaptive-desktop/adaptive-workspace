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

  it('removes a snapshot by object', () => {
    const collection = new ViewportSnapshotCollection();
    const snapshot = {
      id: 'v2',
      isDefault: false,
      isMaximized: false,
      isMinimized: false,
      isRequired: false,
      workspaceContextId: 'ctx2',
      timestamp: fixedTimestamp,
    };
    collection.add(snapshot);
    expect(collection.getAll().length).toBe(1);
    expect(collection.remove(snapshot)).toBe(true);
    expect(collection.getAll().length).toBe(0);
  });

  it('returns false if snapshot does not exist (object)', () => {
    const collection = new ViewportSnapshotCollection();
    const fakeSnapshot = {
      id: 'notfound',
      isDefault: false,
      isMaximized: false,
      isMinimized: false,
      isRequired: false,
      workspaceContextId: 'ctx2',
      timestamp: fixedTimestamp,
    };
    expect(collection.remove(fakeSnapshot)).toBe(false);
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
    const snap = {
      id: 'v1',
      isDefault: false,
      isMaximized: false,
      isMinimized: false,
      isRequired: false,
      workspaceContextId: 'ctx1',
      timestamp: 1,
    };
    c.add(snap);
    expect(c.remove(snap)).toBe(true);
    expect(c.getAll()).toHaveLength(0);
  });

  it('returns false when updating or removing non-existent id', () => {
    const c = new ViewportSnapshotCollection();
    expect(c.update({ id: 'nope', isMinimized: true })).toBe(false);
    // Try to remove a snapshot that doesn't exist
    const fakeSnap = {
      id: 'nope',
      isDefault: false,
      isMaximized: false,
      isMinimized: false,
      isRequired: false,
      workspaceContextId: 'ctx1',
      timestamp: 1,
    };
    expect(c.remove(fakeSnap)).toBe(false);
  });
});
