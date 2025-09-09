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
    viewport: Viewport | string,
    direction: 'up' | 'down' | 'left' | 'right',
    ratio?: number
  ): Viewport {
    const viewportObj = this.resolveViewport(viewport);
    return this.layout.splitViewport(viewportObj, direction, ratio);
  }

  removeViewport(viewport: Viewport | string): boolean {
    const viewportObj = this.resolveViewport(viewport);
    return this.layout.removeViewport(viewportObj);
  }

  swapViewports(viewport1: Viewport | string, viewport2: Viewport | string): boolean {
    const viewport1Obj = this.resolveViewport(viewport1);
    const viewport2Obj = this.resolveViewport(viewport2);
    return this.layout.swapViewports(viewport1Obj, viewport2Obj);
  }

  getViewports(): Viewport[] {
    return this.layout.getViewports();
  }

  hasViewport(viewportId: string): boolean {
    return this.layout.findViewportById(viewportId) !== null;
  }

  minimizeViewport(viewport: Viewport | string): boolean {
    const viewportObj = this.resolveViewport(viewport);
    return this.layout.minimizeViewport(viewportObj);
  }

  maximizeViewport(viewport: Viewport | string): boolean {
    const viewportObj = this.resolveViewport(viewport);
    return this.layout.maximizeViewport(viewportObj);
  }

  restoreViewport(viewport: Viewport | string): boolean {
    const viewportObj = this.resolveViewport(viewport);
    return this.layout.restoreViewport(viewportObj);
  }

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

  private resolveViewport(viewportOrId: Viewport | string): Viewport {
    if (typeof viewportOrId === 'string') {
      const viewport = this.layout.findViewportById(viewportOrId);
      if (!viewport) {
        throw new Error(`Viewport not found: ${viewportOrId}`);
      }
      return viewport;
    }
    return viewportOrId;
  }
}
