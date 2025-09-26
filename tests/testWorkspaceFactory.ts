import fs from 'fs';
import path from 'path';
import { Workspace } from '../src/workspace/Workspace';
import { WorkspaceContext } from '../src/workspace/types';
import { ViewportSnapshotCollection } from '../src/viewport/snapshot/ViewportSnapshotCollection';
import { WorkspaceContextCollection } from '../src/workspace/context/WorkspaceContextCollection';
import { TestIdGenerator } from './TestIdGenerator';
import { loadDesktopSnapshot } from '../src/shared/test/loadDesktopSnapshot';

const defaultSnapshot = loadDesktopSnapshot();

/**
 * Create a Workspace instance matching the desktop-snapshot.json structure, with optional overrides.
 * @param overrides Partial snapshot structure to override defaults.
 * @param idGenerator Optional TestIdGenerator (default: new TestIdGenerator('test'))
 */
export function createTestWorkspaceFromSnapshotData(
  overrides: Partial<typeof defaultSnapshot> = {},
  idGenerator: TestIdGenerator = new TestIdGenerator('test')
): Workspace {
  const data = { ...defaultSnapshot, ...overrides };
  const workspaceContexts: WorkspaceContext[] = data.workspaceContexts.map((context: any) => {
    return {
      id: context.id,
      name: context.name,
      orientation: context.orientation || 'landscape',
      aspectRatio: context.aspectRatio || 1,
      sizeCategory: context.sizeCategory || 'lg',
      deviceType: context.deviceType || 'desktop',
      minimumViewportScreenHeight: context.minimumViewportScreenHeight,
      minimumViewportScreenWidth: context.minimumViewportScreenWidth,
      viewportSnapshots: new ViewportSnapshotCollection(context.viewportSnapshots),
      maxScreenBounds: context.maxScreenBounds || { x: 0, y: 0, width: 1440, height: 900 },
    };
  });
  const contextCollection = new WorkspaceContextCollection(workspaceContexts);
  const config = {
    id: data.id,
    name: data.name,
    workspaceContexts: contextCollection,
    idGenerator,
  };
  return new Workspace(config);
}
