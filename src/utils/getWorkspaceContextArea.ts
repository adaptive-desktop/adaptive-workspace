import { WorkspaceContext } from '../workspace/types';

/**
 * Returns the area (width * height) of the WorkspaceContext's screenBounds.
 * Returns 0 if screenBounds is missing.
 */
export function getWorkspaceContextArea(context: WorkspaceContext): number {
  if (!context.maxScreenBounds) return 0;
  return context.maxScreenBounds.width * context.maxScreenBounds.height;
}
