/**
 * @fileoverview Layout Manager class
 *
 * Concrete implementation of layout management functionality.
 * This will eventually integrate with LayoutTree for full functionality.
 */

import { LayoutManagerInterface } from './types';
import { Viewport, ProportionalBounds, MutableViewport } from '../viewport';
import { ScreenBounds } from '../workspace/types';
import { ulid } from 'ulid';

// Temporary interface for layout compatibility
interface ViewportPosition {
  row: number;
  column: number;
}

/**
 * Layout Manager class
 *
 * Concrete implementation of the LayoutManager interface.
 * Currently a minimal implementation - will be enhanced with LayoutTree integration.
 */
export class LayoutManager<T> implements LayoutManagerInterface<T> {
  private template: T[][] = [];
  private viewports: Map<string, MutableViewport> = new Map();
  private workspaceBounds!: ScreenBounds; // Will be set by setPosition()

  constructor() {
    // Position will be set by workspace via setPosition()
  }

  // Viewport management operations
  createViewport(proportionalBounds?: ProportionalBounds): Viewport {
    const id = ulid();

    // Use provided bounds or find optimal placement
    const bounds = proportionalBounds || this.findLargestAvailableSpace();

    const viewport = new MutableViewport({
      id,
      proportionalBounds: bounds,
      workspaceBounds: this.workspaceBounds,
    });

    this.viewports.set(id, viewport);

    // Also add to legacy template for compatibility
    this.template.push([id as T]);

    return viewport;
  }

  private findLargestAvailableSpace(): ProportionalBounds {
    if (this.viewports.size === 0) {
      // No existing viewports - use full workspace
      return { x: 0, y: 0, width: 1.0, height: 1.0 };
    }

    // TODO: Implement intelligent space finding algorithm
    // For now, return a simple fallback
    return { x: 0, y: 0, width: 0.5, height: 0.5 };
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

    // Also remove from legacy template
    this.template = this.template.filter(
      (row) => row.filter((cell) => cell !== (viewportId as T)).length > 0
    );

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

  // Legacy viewport query operations (for compatibility)
  getViewportAt(position: ViewportPosition): T | null {
    if (this.template.length === 0) return null;
    if (position.row >= this.template.length || position.column >= this.template[0].length)
      return null;
    if (position.row < 0 || position.column < 0) return null;
    return this.template[position.row][position.column];
  }

  getAllViewports(): T[] {
    return this.template.flat().filter((panel) => panel !== null);
  }

  getViewportCount(): number {
    return this.getAllViewports().length;
  }

  getLayoutTemplate(): T[][] {
    return this.template.map((row) => [...row]); // Deep copy
  }

  getViewportBounds(viewportId: T) {
    // Find the viewport in the template
    for (let row = 0; row < this.template.length; row++) {
      for (let col = 0; col < this.template[row].length; col++) {
        if (this.template[row][col] === viewportId) {
          return {
            name: viewportId as string,
            rowStart: row,
            rowEnd: row + 1,
            columnStart: col,
            columnEnd: col + 1,
          };
        }
      }
    }
    return null;
  }

  // Multi-viewport operations
  insertViewport(
    viewportPositions: ViewportPosition[],
    newViewportId: T,
    direction?: 'above' | 'below' | 'left' | 'right'
  ): boolean {
    // Special case: empty layout
    if (this.template.length === 0) {
      this.template = [[newViewportId]];
      return true;
    }

    // TODO: Implement for non-empty layouts
    console.log('insertViewport called with:', { viewportPositions, newViewportId, direction });
    return false;
  }

  // Utility operations
  isValidPosition(position: ViewportPosition): boolean {
    if (this.template.length === 0) {
      return false;
    }
    const rows = this.template.length;
    const columns = this.template[0]?.length || 0;
    return (
      position.row >= 0 && position.row < rows && position.column >= 0 && position.column < columns
    );
  }

  getPositionForViewport(viewportId: T): ViewportPosition | null {
    for (let row = 0; row < this.template.length; row++) {
      for (let col = 0; col < this.template[row].length; col++) {
        if (this.template[row][col] === viewportId) {
          return { row, column: col };
        }
      }
    }
    return null;
  }

  canSplitViewport(position: ViewportPosition): boolean {
    return this.isValidPosition(position);
  }

  canRemoveViewport(position: ViewportPosition): boolean {
    return this.isValidPosition(position) && this.getViewportCount() > 1;
  }
}
