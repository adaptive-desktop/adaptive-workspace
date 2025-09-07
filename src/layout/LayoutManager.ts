/**
 * @fileoverview Layout Manager class
 *
 * Concrete implementation of layout management functionality.
 * This will eventually integrate with LayoutTree for full functionality.
 */

import { Viewport, ProportionalBounds, MutableViewport } from '../viewport';
import { ScreenBounds } from '../workspace/types';
import { ulid } from 'ulid';

/**
 * Layout Manager class
 *
 * Manages viewport creation, positioning, and sizing within a workspace.
 * Provides the core functionality for viewport management.
 */
export class LayoutManager {
  private viewports: Map<string, MutableViewport> = new Map();
  private workspaceBounds!: ScreenBounds; // Will be set by setPosition()

  constructor() {
    // Position will be set by workspace via setPosition()
  }

  // Viewport management operations
  createViewport(proportionalBounds?: ProportionalBounds): Viewport {
    // Use provided bounds or find optimal placement
    const bounds = proportionalBounds || this.findLargestAvailableSpace();

    // Create viewport with the determined bounds
    return this.createViewportInternal(bounds);
  }

  /**
   * Private method to create a new viewport with specified proportional bounds
   * Sets ID, workspace bounds, and adds to viewport collection
   */
  private createViewportInternal(proportionalBounds: ProportionalBounds): MutableViewport {
    const id = ulid();

    const viewport = new MutableViewport({
      id,
      proportionalBounds,
      workspaceBounds: this.workspaceBounds,
    });

    this.viewports.set(id, viewport);

    return viewport;
  }

  private findLargestAvailableSpace(): ProportionalBounds {
    if (this.viewports.size === 0) {
      // No existing viewports - use full workspace
      return { x: 0, y: 0, width: 1.0, height: 1.0 };
    }

    // Throw error if there are already viewports - space calculation not implemented yet
    throw new Error('findLargestAvailableSpace not implemented for existing viewports. Please provide explicit proportional bounds.');
  }

  getViewports(): Viewport[] {
    return Array.from(this.viewports.values());
  }

  hasViewport(viewportId: string): boolean {
    return this.viewports.has(viewportId);
  }

  createAdjacentViewport(
    existingViewports: Viewport[],
    direction: 'above' | 'below' | 'left' | 'right',
    size?: { width?: number; height?: number }
  ): Viewport {
    // TODO: Implement adjacent viewport calculation
    // For now, return a placeholder
    console.log('createAdjacentViewport called with:', { existingViewports, direction, size });
    throw new Error('createAdjacentViewport not yet implemented');
  }

  splitViewport(viewport: Viewport, direction: 'horizontal' | 'vertical'): Viewport {
    // TODO: Implement viewport splitting
    // For now, return a placeholder
    console.log('splitViewport called with:', { viewport: viewport.id, direction });
    throw new Error('splitViewport not yet implemented');
  }

  removeViewport(viewportId: string): boolean {
    const removed = this.viewports.delete(viewportId);
    return removed;
  }

  removeViewportByObject(viewport: Viewport): boolean {
    return this.removeViewport(viewport.id);
  }

  swapViewports(viewport1: Viewport, viewport2: Viewport): boolean {
    // TODO: Implement viewport swapping
    // For now, return false
    console.log('swapViewports called with:', { viewport1: viewport1.id, viewport2: viewport2.id });
    return false;
  }

  setPosition(position: ScreenBounds): void {
    this.workspaceBounds = position;
    this.viewports.forEach((viewport) => {
      viewport.updateWorkspaceBounds(position);
    });
  }

  getViewportCount(): number {
    return this.viewports.size;
  }
}
