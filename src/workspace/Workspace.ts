/**
 * @fileoverview Workspace class implementation
 *
 * Concrete implementation of the workspace interface.
 */

import { WorkspaceInterface, WorkspaceConfig, ScreenBounds } from './types';
import { LayoutManager } from '../layout/LayoutManager';
import { Viewport, ProportionalBounds } from '../viewport';
import { IdGenerator } from '../shared/types';

/**
 * Workspace class
 *
 * A workspace is a container that holds a layout and has a position on screen.
 * Immutable - all update operations return new instances.
 */
export class Workspace implements WorkspaceInterface {
  public readonly id: string;
  public readonly screenBounds: ScreenBounds;
  public readonly layout: LayoutManager;
  private readonly idGenerator: IdGenerator;

  constructor(config: WorkspaceConfig) {
    this.id = config.id;
    this.screenBounds = config.screenBounds;
    this.idGenerator = config.idGenerator;
    this.layout = config.layout || this.createDefaultLayout();

    // Initialize layout manager with workspace screen bounds
    this.layout.setScreenBounds(this.screenBounds);
  }

  // Viewport operations
  /**
   * Create a new viewport in the workspace
   */
  createViewport(proportionalBounds?: ProportionalBounds): Viewport {
    // Delegate to layout manager (it will find optimal placement if no bounds provided)
    return this.layout.createViewport(proportionalBounds);
  }

  /**
   * Create a viewport adjacent to existing viewports
   */
  createAdjacentViewport(
    existingViewportsOrIds: (Viewport | string)[],
    direction: 'up' | 'down' | 'left' | 'right',
    size?: { width?: number; height?: number }
  ): Viewport {
    // Resolve any IDs to viewport objects
    const existingViewports = existingViewportsOrIds.map((viewportOrId) => {
      if (typeof viewportOrId === 'string') {
        const viewport = this.layout.findViewportById(viewportOrId);
        if (!viewport) {
          throw new Error(`Viewport not found: ${viewportOrId}`);
        }
        return viewport;
      }
      return viewportOrId;
    });

    return this.layout.createAdjacentViewport(existingViewports, direction, size);
  }

  /**
   * Split a viewport into two viewports
   */
  splitViewport(
    viewportOrId: Viewport | string,
    direction: 'up' | 'down' | 'left' | 'right'
  ): Viewport {
    const viewport =
      typeof viewportOrId === 'string' ? this.layout.findViewportById(viewportOrId) : viewportOrId;

    if (!viewport) {
      throw new Error(`Viewport not found: ${viewportOrId}`);
    }

    return this.layout.splitViewport(viewport, direction);
  }

  /**
   * Remove a viewport
   */
  removeViewport(viewport: Viewport): boolean {
    return this.layout.removeViewport(viewport);
  }

  /**
   * Swap two viewports
   */
  swapViewports(viewport1: Viewport, viewport2: Viewport): boolean {
    return this.layout.swapViewports(viewport1, viewport2);
  }

  // Viewport queries
  /**
   * Get all viewports
   */
  getViewports(): Viewport[] {
    return this.layout.getViewports();
  }

  /**
   * Check if viewport exists
   */
  hasViewport(viewportId: string): boolean {
    return this.layout.hasViewport(viewportId);
  }

  // Position operations
  /**
   * Update workspace screen bounds (position and size)
   */
  updateScreenBounds(newScreenBounds: ScreenBounds): void {
    // Update workspace screen bounds
    (this as { -readonly [K in keyof this]: this[K] }).screenBounds = newScreenBounds;

    // Let layout manager handle all viewport updates
    this.layout.setScreenBounds(newScreenBounds);
  }

  /**
   * Create default layout manager
   * @private
   */
  private createDefaultLayout(): LayoutManager {
    // TODO: Replace with proper LayoutTree-based implementation
    return new LayoutManager(this.idGenerator);
  }
}
