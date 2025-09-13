import fs from 'fs';
import path from 'path';
import { WorkspaceFactory } from '../src/workspace/WorkspaceFactory';
import { TestIdGenerator } from '../src/shared/TestIdGenerator';

describe('Workspace restoration from snapshot example', () => {
  it('should restore a workspace and contexts from the JSON example', () => {
    const snapshotPath = path.join(__dirname, 'LAYOUT_SNAPSHOT_EXAMPLES.json');
    const raw = fs.readFileSync(snapshotPath, 'utf-8');
    const snapshot = JSON.parse(raw);

    // Restore a Workspace from the snapshot using the factory
    const idGen = new TestIdGenerator('test');
  // Simulate device screen bounds (e.g., for laptop context)
  const screenBounds = { x: 0, y: 0, width: 1440, height: 900 };
  const factory = new WorkspaceFactory(idGen);
  const workspace = factory.fromSnapshot(snapshot, screenBounds);
    expect(workspace).toBeDefined();
    expect(workspace.id).toBe(snapshot.workspaceId);
    // Validate that the layout and viewports are set up
    const viewports = workspace.getViewports();
    expect(Array.isArray(viewports)).toBe(true);
    expect(viewports.length).toBeGreaterThan(0);
    for (const vp of viewports) {
      expect(vp).toHaveProperty('id');
      expect(vp).toHaveProperty('proportionalBounds');
    }
  });
});
