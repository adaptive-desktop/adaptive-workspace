import { Viewport, MutableViewport } from '.';
import { ProportionalBounds, ScreenBounds } from '../workspace/types';
import { IdGenerator } from '../shared/types';
import { WorkspaceContext } from '../workspace/types';
import { WorkspaceContextDetector } from '../workspace/context/WorkspaceContextDetector';
import { ViewportSnapshotManager } from './snapshot/ViewportSnapshotManager';

/**
 * Viewport Manager class
 *
 * Manages viewport creation, positioning, and sizing within a workspace.
 * Provides the core functionality for viewport management.
 */
export class ViewportManager {
  private viewports: Map<string, MutableViewport> = new Map();
  private workspaceBounds!: ScreenBounds; // Will be set by setScreenBounds()
  private idGenerator: IdGenerator;
  private viewportSnapshotManager: ViewportSnapshotManager;

  private currentContext?: WorkspaceContext;

  constructor(contexts: WorkspaceContext[], idGenerator: IdGenerator) {
    this.idGenerator = idGenerator;
    this.viewportSnapshotManager = new ViewportSnapshotManager(contexts, idGenerator);
  }

  /**
   * Rebuilds the internal viewport map from the given WorkspaceContext's viewportStates array.
   * Destroys all existing viewports and creates new ones as described by the context.
   */
  applyWorkspaceContext(context: WorkspaceContext): void {
    this.viewports.clear();
    this.workspaceBounds = context.screenBounds!;
    if (context.viewportStates) {
      for (const state of context.viewportStates) {
        const viewport = this.createViewportFromState(state);
        this.viewports.set(state.viewportId, viewport);
      }
    }
    this.currentContext = context;
  }

  // Viewport management operations
  createViewport(proportionalBounds?: ProportionalBounds): Viewport {
    // Use provided bounds or find optimal placement
    const bounds = proportionalBounds || this.findLargestAvailableSpace();
    const snapshot = this.viewportSnapshotManager.addViewport(bounds);
    this.mutateViewports();

    return this.findViewportById(snapshot.id)!;
  }

  getViewports(): Viewport[] {
    return Array.from(this.viewports.values());
  }

  findViewportById(id: string): Viewport | null {
    return this.viewports.get(id) || null;
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

  splitViewport(
    viewport: Viewport,
    direction: 'up' | 'down' | 'left' | 'right',
    _ratio?: number
  ): Viewport {
    const mutableViewport = viewport as MutableViewport;
    const currentBounds = mutableViewport.proportionalBounds;

    let originalBounds: ProportionalBounds;
    let newBounds: ProportionalBounds;

    switch (direction) {
      case 'down':
        // Original viewport becomes top half
        originalBounds = {
          x: currentBounds.x,
          y: currentBounds.y,
          width: currentBounds.width,
          height: currentBounds.height / 2,
        };
        // New viewport becomes bottom half
        newBounds = {
          x: currentBounds.x,
          y: currentBounds.y + currentBounds.height / 2,
          width: currentBounds.width,
          height: currentBounds.height / 2,
        };
        break;

      case 'up':
        // Original viewport becomes bottom half
        originalBounds = {
          x: currentBounds.x,
          y: currentBounds.y + currentBounds.height / 2,
          width: currentBounds.width,
          height: currentBounds.height / 2,
        };
        // New viewport becomes top half
        newBounds = {
          x: currentBounds.x,
          y: currentBounds.y,
          width: currentBounds.width,
          height: currentBounds.height / 2,
        };
        break;

      case 'right':
        // Original viewport becomes left half
        originalBounds = {
          x: currentBounds.x,
          y: currentBounds.y,
          width: currentBounds.width / 2,
          height: currentBounds.height,
        };
        // New viewport becomes right half
        newBounds = {
          x: currentBounds.x + currentBounds.width / 2,
          y: currentBounds.y,
          width: currentBounds.width / 2,
          height: currentBounds.height,
        };
        break;

      case 'left':
        // Original viewport becomes right half
        originalBounds = {
          x: currentBounds.x + currentBounds.width / 2,
          y: currentBounds.y,
          width: currentBounds.width / 2,
          height: currentBounds.height,
        };
        // New viewport becomes left half
        newBounds = {
          x: currentBounds.x,
          y: currentBounds.y,
          width: currentBounds.width / 2,
          height: currentBounds.height,
        };
        break;

      default:
        throw new Error(`Invalid split direction: ${direction}`);
    }

    // Update original viewport bounds
    mutableViewport.updateProportionalBounds(originalBounds);

    // Create new viewport with calculated bounds
    const newViewport = this.createViewportInternal(newBounds);

    return newViewport;
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
    // Update context using WorkspaceContextDetector
    this.currentContext = WorkspaceContextDetector.detectContext(screenBounds);
    this.viewports.forEach((viewport) => {
      viewport.updateWorkspaceBounds(screenBounds);
    });
  }

  /**
   * Returns the current layout context (orientation, aspect ratio, etc)
   */
  getCurrentContext(): WorkspaceContext {
    if (!this.currentContext && this.workspaceBounds) {
      // Fallback: compute if not set
      this.currentContext = WorkspaceContextDetector.detectContext(this.workspaceBounds);
    }
    if (!this.currentContext) {
      throw new Error('Screen bounds not set. Cannot determine current context.');
    }
    return this.currentContext;
  }

  getViewportCount(): number {
    return this.viewports.size;
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

  /**
   * Private method to create a new viewport with specified proportional bounds
   * Sets ID, workspace bounds, and adds to viewport collection
   */
  private createViewportInternal(viewportRequest: ViewportRequest) {
    viewportRequest.id = viewportRequest.id ?? this.idGenerator.generate();

    const viewportState = this.viewportSnapshotManager.addViewport(viewportRequest);

    return viewportState;
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
