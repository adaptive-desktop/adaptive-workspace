import { Viewport, ViewportSnapshot } from '../types';
import { ProportionalBounds, WorkspaceContext } from '../../workspace/types';
import { WorkspaceContextCollection } from '../../workspace/context/WorkspaceContextCollection';
import { getWorkspaceContextArea } from '../../utils/getWorkspaceContextArea';
import { IdGenerator } from '../../shared';

/**
 * Manages viewport snapshots for all known layout contexts.
 */
export class ViewportSnapshotManager {
  private contexts: WorkspaceContextCollection;
  private currentWorkspaceContext?: WorkspaceContext;
  private idGenerator: IdGenerator;

  constructor(contexts: WorkspaceContextCollection, idGenerator: IdGenerator) {
    this.contexts = contexts;
    this.idGenerator = idGenerator;
  }

  addAdjacentViewport(
    _existingViewports: Viewport[],
    _direction: 'up' | 'down' | 'left' | 'right'
  ): ViewportSnapshot {
    // existing viewports must be adjusted to make space for the new viewport before calling this.addViewport()
    throw new Error('Not implemented');
  }

  getSnapshotsForContext(contextId: string): ViewportSnapshot[] {
    return this.contexts
      .getAll()
      .filter((context) => context.id === contextId)
      .flatMap((context) => context.viewportSnapshots.getAll());
  }

  importSnapshot(snapshot: ViewportSnapshot): void {
    this.addSnapshot(snapshot);
  }

  minimizeViewport(viewport: Viewport): boolean {
    // Use the collection to update isMinimized, leave bounds as is
    return this.contexts.updateViewport({
      id: viewport.id,
      isMaximized: false,
      isMinimized: true,
    });
  }

  maximizeViewport(viewport: Viewport): boolean {
    // Set isMaximized true and isMinimized false
    return this.contexts.updateViewport({
      id: viewport.id,
      isMaximized: true,
      isMinimized: false,
    });
  }

  restoreViewport(viewport: Viewport): boolean {
    // Restore means un-minimize and un-maximize
    return this.contexts.updateViewport({
      id: viewport.id,
      isMaximized: false,
      isMinimized: false,
    });
  }

  splitViewport(
    _viewport: Viewport,
    _direction: 'up' | 'down' | 'left' | 'right'
  ): ViewportSnapshot {
    // viewport must be adjusted to make space for the new viewport before calling this.addViewport()
    throw new Error('Not implemented');
  }

  addViewport(bounds: ProportionalBounds, id?: string): Viewport {
    if (!this.currentWorkspaceContext || !this.currentWorkspaceContext.id) {
      throw new Error('The current WorkspaceContext must be set');
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
      timestamp: Date.now(),
    };

    this.addSnapshot(snapshot);

    // todo: mutate and return the new viewport
    return { ...snapshot, screenBounds: { x: 0, y: 0, width: 100, height: 100 } };
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
      const now = Date.now();
      if (isSmaller) {
        context.viewportSnapshots.add({
          ...snapshot,
          isMinimized: true,
          bounds: undefined,
          timestamp: now,
        });
      } else {
        context.viewportSnapshots.add({
          ...snapshot,
          timestamp: now,
        });
      }
    }
  }

  adjustViewport(_proportionalBounds: ProportionalBounds, _viewport: Viewport): ViewportSnapshot {
    throw new Error('Not implemented');
  }

  removeViewport(viewport: ViewportSnapshot): boolean {
    return this.contexts.removeViewport(viewport);
  }
}
