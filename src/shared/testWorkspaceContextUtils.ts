import { WorkspaceContext, ScreenBounds } from '../workspace/types';
import { WorkspaceContextCollection } from '../workspace/context/WorkspaceContextCollection';
import { ViewportSnapshotCollection } from '../viewport/snapshot/ViewportSnapshotCollection';

let contextId = 0;

export function createTestWorkspaceContext(
  overrides: Partial<WorkspaceContext> = {},
  bounds: ScreenBounds = { x: 0, y: 0, width: 1000, height: 800 }
): WorkspaceContext {
  contextId += 1;
  // Determine orientation, breakpoint, and sizeCategory based on bounds
  const orientation = bounds.width >= bounds.height ? 'landscape' : 'portrait';
  let breakpoint: 'sm' | 'md' | 'lg' | 'xl';
  if (bounds.width < 1024) breakpoint = 'sm';
  else if (bounds.width < 1600) breakpoint = 'md';
  else if (bounds.width < 2560) breakpoint = 'lg';
  else breakpoint = 'xl';
  let sizeCategory: 'small' | 'medium' | 'large' | 'extra-large';
  switch (breakpoint) {
    case 'sm':
      sizeCategory = 'small';
      break;
    case 'md':
      sizeCategory = 'medium';
      break;
    case 'lg':
      sizeCategory = 'large';
      break;
    case 'xl':
      sizeCategory = 'extra-large';
      break;
  }
  return {
    id: `test-ctx-${contextId}`,
    name: `Test Context ${contextId}`,
    orientation,
    breakpoint,
    maxScreenBounds: bounds,
    sizeCategory,
    aspectRatio: bounds.width / bounds.height,
    deviceType: 'desktop',
    minimumViewportScreenHeight: 100,
    minimumViewportScreenWidth: 100,
    snapshots: new ViewportSnapshotCollection(),
    ...overrides,
  };
}

export function createTestWorkspaceContextCollection(
  contexts?: Partial<WorkspaceContext>[],
  bounds: ScreenBounds = { x: 0, y: 0, width: 1000, height: 800 }
): WorkspaceContextCollection {
  const collection = new WorkspaceContextCollection();
  if (contexts && contexts.length > 0) {
    for (const ctx of contexts) {
      collection.addContext(createTestWorkspaceContext(ctx, bounds));
    }
  } else {
    // Add a default context if none provided
    collection.addContext(createTestWorkspaceContext({}, bounds));
  }
  return collection;
}
