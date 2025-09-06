/**
 * @fileoverview Workspace class implementation
 *
 * Concrete implementation of the workspace interface.
 */

import { WorkspaceInterface, WorkspaceConfig, ScreenBounds } from './types';
import { LayoutManagerInterface } from '../layout/types';
import { LayoutManager } from '../layout/LayoutManager';
import { Viewport, ProportionalBounds } from '../viewport';

/**
 * Workspace class
 *
 * A workspace is a container that holds a layout and has a position on screen.
 * Immutable - all update operations return new instances.
 */
export class Workspace implements WorkspaceInterface {
  public readonly id: string;
  public readonly position: ScreenBounds;
  public readonly layout: LayoutManagerInterface<string>;

  constructor(config: WorkspaceConfig) {
    this.id = config.id;
    this.position = config.position;
    this.layout = config.layout || this.createDefaultLayout();

    // Initialize layout manager with workspace position
    this.layout.setPosition(this.position);
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
    existingViewports: Viewport[],
    direction: 'above' | 'below' | 'left' | 'right',
    size?: { width?: number; height?: number }
  ): Viewport {
    return this.layout.createAdjacentViewport(existingViewports, direction, size);
  }

  /**
   * Split a viewport into two viewports
   */
  splitViewport(viewport: Viewport, direction: 'horizontal' | 'vertical'): Viewport {
    return this.layout.splitViewport(viewport, direction);
  }

  /**
   * Remove a viewport
   */
  removeViewport(viewport: Viewport): boolean {
    return this.layout.removeViewportByObject(viewport);
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
   * Update workspace position
   */
  updatePosition(newPosition: ScreenBounds): void {
    // Update workspace position
    (this as { -readonly [K in keyof this]: this[K] }).position = newPosition;

    // Let layout manager handle all viewport updates
    this.layout.setPosition(newPosition);
  }

  /**
   * Create default layout manager
   * @private
   */
  private createDefaultLayout(): LayoutManagerInterface<string> {
    // TODO: Replace with proper LayoutTree-based implementation
    return new LayoutManager<string>();
  }
}
