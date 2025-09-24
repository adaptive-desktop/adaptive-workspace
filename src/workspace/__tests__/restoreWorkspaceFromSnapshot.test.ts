import fs from 'fs';
import path from 'path';
import { WorkspaceFactory } from '../WorkspaceFactory';
import { TestIdGenerator } from '../../../tests/TestIdGenerator';

describe('Workspace restoration from snapshot example', () => {
  it('should restore a workspace and contexts from the JSON example', () => {
    const snapshotPath = path.join(__dirname, '../../../tests/desktop-snapshot.json');
    const raw = fs.readFileSync(snapshotPath, 'utf-8');
    const snapshot = JSON.parse(raw);

    // Restore a Workspace from the snapshot using the factory
    const idGenerator = new TestIdGenerator('test');
    // Simulate device screen bounds (e.g., for laptop context)
    const screenBounds = { x: 0, y: 0, width: 1440, height: 900 };
    const factory = new WorkspaceFactory(idGenerator);
    const workspace = factory.fromSnapshot(snapshot, screenBounds);
    workspace.setScreenBounds(screenBounds);

    expect(workspace).toBeDefined();
    expect(workspace.id).toBe(snapshot.id);
    expect(workspace.name).toBe(snapshot.name);

    // Validate that the layout and viewports are set up
    const snapshots = workspace.viewportManager.getSnapshotsForContext('laptop');
    expect(Array.isArray(snapshots)).toBe(true);
    expect(snapshots.length).toBe(2);

    // Check the first snapshot (main)
    const mainSnap = snapshots.find((s) => s.id === 'main');
    expect(mainSnap).toBeDefined();
    expect(mainSnap).toMatchObject({
      id: 'main',
      bounds: { x: 0, y: 0, width: 0.75, height: 1 },
      isDefault: true,
      isMaximized: false,
      isMinimized: false,
      isRequired: true,
    });

    // Check the second snapshot (side)
    const sideSnap = snapshots.find((s) => s.id === 'side');
    expect(sideSnap).toBeDefined();
    expect(sideSnap).toMatchObject({
      id: 'side',
      bounds: { x: 0, y: 0, width: 0.25, height: 1 },
      isDefault: false,
      isMaximized: false,
      isMinimized: true,
      isRequired: false,
    });
  });
});
