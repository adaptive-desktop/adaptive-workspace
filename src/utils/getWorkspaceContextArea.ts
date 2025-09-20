import { WorkspaceContext } from '../workspace/types';

/**
 * Returns the area (width * height) of the WorkspaceContext's screenBounds.
 * Returns 0 if screenBounds is missing.
 */
export function getWorkspaceContextArea(context: WorkspaceContext): number {
  if (!context.screenBounds) return 0;
  return context.screenBounds.width * context.screenBounds.height;
}
