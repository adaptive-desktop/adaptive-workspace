import { Viewport, ViewportSnapshot, ViewportState } from './types';
import { ProportionalBounds, WorkspaceContext } from '../workspace/types';
import { getWorkspaceContextArea } from '../utils/getWorkspaceContextArea';
import { IdGenerator } from '../shared';

/**
 * Manages viewport snapshots for all known layout contexts.
 */
export class ViewportSnapshotManager {
  private contexts: WorkspaceContext[];
  private currentWorkspaceContext?: WorkspaceContext;
  private idGenerator: IdGenerator;

  constructor(
    contexts: WorkspaceContext[],
    idGenerator: IdGenerator,
  ) {
    this.contexts = contexts;
    this.idGenerator = idGenerator;
  }

  addAdjacentViewport(
    existingViewports: Viewport[],
    direction: 'up' | 'down' | 'left' | 'right',
  ): ViewportSnapshot {
    // existing viewports must be adjusted to make space for the new viewport before calling this.addViewport()
    throw new Error('Not implemented');
  }

  splitViewport(viewport: Viewport, direction: 'up' | 'down' | 'left' | 'right'): ViewportSnapshot {
    // viewport must be adjusted to make space for the new viewport before calling this.addViewport()
    throw new Error('Not implemented');
  }

  minimizeViewport(viewport: Viewport): boolean {
    return false;
  }

  maximizeViewport(viewport: Viewport): boolean {
    return false;
  }

  restoreViewport(viewport: Viewport): boolean { // is this really needed? not sure what is being restored
    return false;
  }
  
  addViewport(bounds: ProportionalBounds, id?: string): ViewportSnapshot {
    if (!this.currentWorkspaceContext || !this.currentWorkspaceContext.id) {
      throw new Error("The current WorkspaceContext must be set");
    }
    // todo: validation and adjustments
    id = id ?? this.idGenerator.generate();

    const snapshot: ViewportSnapshot = {
      bounds,
      id,
      isDefault: false,
      isMaximized: false,
      isMinimized: false,
      isRequired: false,
      workspaceContextId: this.currentWorkspaceContext.id
    }

    this.addSnapshot(snapshot);

    return snapshot;
  }

  setCurrentWorkspaceContext(workspaceContext: WorkspaceContext) {
    this.currentWorkspaceContext = workspaceContext;
  }

  private addSnapshot(snapshot: ViewportSnapshot) {
    if (!this.currentWorkspaceContext) return;
    const currentArea = getWorkspaceContextArea(this.currentWorkspaceContext);
    for (const context of this.contexts) {
      // Compare area of screenBounds
      const area = getWorkspaceContextArea(context);
      const isSmaller = area < currentArea;
      if (isSmaller) {
        context.viewportState.viewportSnapshots.push({
          ...snapshot,
          isMinimized: true,
          bounds: undefined,
          workspaceContextId: context.id!
        });
      } else {
        context.viewportState.viewportSnapshots.push({
          ...snapshot,
          workspaceContextId: context.id!
        });
      }
    }
  }

  adjustViewport(proportionalBounds: ProportionalBounds, viewport: Viewport): ViewportSnapshot {
    throw new Error('Not implemented');
  }


 removeViewport(viewport: Viewport): boolean {
    // requires adjusting other viewportSnapshots after deleting the ViewportSnapshot from all 
    return false;
  }


  getViewportState(contextId: string): ViewportState {
    const context = this.contexts.find(ctx => ctx.id === contextId);
    return context?.viewportState || { viewportSnapshots: [] };
  }
}
