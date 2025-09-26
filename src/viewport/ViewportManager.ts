import { Viewport, MutableViewport, ViewportSnapshot } from '.';
import { ProportionalBounds, ScreenBounds } from '../workspace/types';
import { IdGenerator } from '../shared/types';
import { WorkspaceContext } from '../workspace/types';
import { WorkspaceContextDetector } from '../workspace/context/WorkspaceContextDetector';
import { ViewportSnapshotManager } from './snapshot/ViewportSnapshotManager';
import { WorkspaceContextCollection } from '../workspace/context/WorkspaceContextCollection';
import { ViewportMutator } from './ViewportMutator';

/**
 * Viewport Manager class
 *
 * Manages viewport creation, positioning, and sizing within a workspace.
 * Provides the core functionality for viewport management.
 */
export class ViewportManager {
  public currentContext?: WorkspaceContext;

  private viewportMutator: ViewportMutator;
  private viewports: Map<string, MutableViewport> = new Map();
  private viewportSnapshotManager: ViewportSnapshotManager;
  private workspaceBounds!: ScreenBounds; // Will be set by setScreenBounds()
  private workspaceContextDetector: WorkspaceContextDetector;

  constructor(
    workspaceContexts: WorkspaceContextCollection,
    idGenerator: IdGenerator,
    viewports: Map<string, MutableViewport>
  ) {
    this.viewports = viewports;
    this.viewportMutator = new ViewportMutator(viewports);
    this.viewportSnapshotManager = new ViewportSnapshotManager(workspaceContexts, idGenerator);
    this.workspaceContextDetector = new WorkspaceContextDetector(workspaceContexts);
  }

  // Viewport management operations
  createViewport(proportionalBounds?: ProportionalBounds): boolean {
    // Use provided bounds or find optimal placement
    const bounds = proportionalBounds || this.findLargestAvailableSpace();
    this.viewportSnapshotManager.addViewport(bounds);

    return true;
  }

  getSnapshotsForContext(contextId: string): ViewportSnapshot[] {
    return this.viewportSnapshotManager.getSnapshotsForContext(contextId);
  }

  createAdjacentViewport(
    existingViewports: Viewport[],
    direction: 'up' | 'down' | 'left' | 'right',
    size?: { width?: number; height?: number }
  ): Viewport {
    // TODO: Implement adjacent viewport calculation
    // For now, return a placeholder
    console.log('createAdjacentViewport called with:', { existingViewports, direction, size });
    throw new Error('createAdjacentViewport not yet implemented');
  }

  getViewportCount(): number {
    return this.viewports.size;
  }

  splitViewport(
    viewport: Viewport,
    direction: 'up' | 'down' | 'left' | 'right',
    ratio?: number
  ): Viewport {
    // TODO: this should be handled in the ViewportSnapshotManager
    console.log('splitViewport called with:', { viewport, direction, ratio });
    throw new Error('createAdjacentViewport not yet implemented');
  }

  removeViewport(viewport: Viewport): boolean {
    return this.viewports.delete(viewport.id);
  }

  swapViewports(viewport1: Viewport, viewport2: Viewport): boolean {
    // TODO: Implement viewport swapping
    // For now, return false
    console.log('swapViewports called with:', { viewport1: viewport1.id, viewport2: viewport2.id });
    return false;
  }

  setScreenBounds(screenBounds: ScreenBounds): void {
    this.workspaceBounds = screenBounds;
    this.currentContext = this.workspaceContextDetector.detectContext(screenBounds);
    this.viewportSnapshotManager.setCurrentWorkspaceContext(this.currentContext);
    this.viewportMutator.mutateFromWorkspaceContext(this.currentContext, screenBounds);
  }

  minimizeViewport(_viewport: Viewport): boolean {
    // Not implemented yet
    return false;
  }

  maximizeViewport(_viewport: Viewport): boolean {
    // Not implemented yet
    return false;
  }

  restoreViewport(_viewport: Viewport): boolean {
    // Not implemented yet
    return false;
  }

  private findLargestAvailableSpace(): ProportionalBounds {
    if (this.viewports.size === 0) {
      // No existing viewports - use full workspace
      return { x: 0, y: 0, width: 1.0, height: 1.0 };
    }

    // Throw error if there are already viewports - space calculation not implemented yet
    throw new Error(
      'findLargestAvailableSpace not implemented for existing viewports. Please provide explicit proportional bounds.'
    );
  }
}
