/**
 * @fileoverview Layout Manager class
 *
 * Concrete implementation of layout management functionality.
 * This will eventually integrate with LayoutTree for full functionality.
 */

import { Viewport, ProportionalBounds, MutableViewport } from '../viewport';
import { ScreenBounds } from '../workspace/types';
import { IdGenerator } from '../shared/types';

/**
 * Layout Manager class
 *
 * Manages viewport creation, positioning, and sizing within a workspace.
 * Provides the core functionality for viewport management.
 */
export class LayoutManager {
  private viewports: Map<string, MutableViewport> = new Map();
  private workspaceBounds!: ScreenBounds; // Will be set by setScreenBounds()
  private idGenerator: IdGenerator;

  constructor(idGenerator: IdGenerator) {
    this.idGenerator = idGenerator;
    // Screen bounds will be set by workspace via setScreenBounds()
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
    const id = this.idGenerator.generate();

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
    throw new Error(
      'findLargestAvailableSpace not implemented for existing viewports. Please provide explicit proportional bounds.'
    );
  }

  getViewports(): Viewport[] {
    return Array.from(this.viewports.values());
  }

  findViewportById(id: string): Viewport | null {
    if (!id) {
      return null;
    }
    return this.viewports.get(id) || null;
  }

  hasViewport(viewportId: string): boolean {
    return this.viewports.has(viewportId);
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

  splitViewport(viewport: Viewport, direction: 'up' | 'down' | 'left' | 'right'): Viewport {
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
    this.viewports.forEach((viewport) => {
      viewport.updateWorkspaceBounds(screenBounds);
    });
  }

  getViewportCount(): number {
    return this.viewports.size;
  }
}
