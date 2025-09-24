import { WorkspaceContext, ScreenBounds } from '../src/workspace/types';
import { WorkspaceContextCollection } from '../src/workspace/context/WorkspaceContextCollection';
import { ViewportSnapshotCollection } from '../src/viewport/snapshot/ViewportSnapshotCollection';

let contextId = 0;

export function createTestWorkspaceContext(
  overrides: Partial<WorkspaceContext> = {},
  bounds: ScreenBounds = { x: 0, y: 0, width: 1000, height: 800 }
): WorkspaceContext {
  contextId += 1;
  // Determine orientation, and sizeCategory based on bounds
  const orientation = bounds.width >= bounds.height ? 'landscape' : 'portrait';
  let sizeCategory: 'sm' | 'md' | 'lg' | 'xl';
  if (bounds.width < 1024) sizeCategory = 'sm';
  else if (bounds.width < 1600) sizeCategory = 'md';
  else if (bounds.width < 2560) sizeCategory = 'lg';
  else sizeCategory = 'xl';

  return {
    id: `test-ctx-${contextId}`,
    name: `Test Context ${contextId}`,
    orientation,
    sizeCategory,
    maxScreenBounds: bounds,
    aspectRatio: bounds.width / bounds.height,
    deviceType: 'desktop',
    minimumViewportScreenHeight: 100,
    minimumViewportScreenWidth: 100,
    viewportSnapshots: new ViewportSnapshotCollection(),
    ...overrides,
  };
}

export function createTestWorkspaceContextCollection(
  contexts?: Partial<WorkspaceContext>[],
  bounds: ScreenBounds = { x: 0, y: 0, width: 1000, height: 800 }
): WorkspaceContextCollection {
  const collection = new WorkspaceContextCollection();
  if (contexts && contexts.length > 0) {
    for (const context of contexts) {
      collection.addContext(createTestWorkspaceContext(context, bounds));
    }
  } else {
    // Add a default context if none provided
    collection.addContext(createTestWorkspaceContext({}, bounds));
  }
  return collection;
}
