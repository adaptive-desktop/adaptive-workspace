/**
 * @fileoverview Workspace factory functions
 * 
 * Factory functions for creating workspaces and related objects.
 * Follows TypeScript conventions for simple object creation.
 */

import { LayoutManager, ViewportPosition } from '../interfaces/LayoutManager';

// Core interfaces for workspace management
export interface ScreenBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Workspace {
  id: string;
  position: ScreenBounds;
  layout: LayoutManager<string>;
}

export interface Viewport {
  panelId: string;
  gridPosition: ViewportPosition;
  screenBounds: ScreenBounds;
}

// Simple LayoutManager implementation for now
// TODO: Replace with full implementation that uses LayoutTree
class SimpleLayoutManager implements LayoutManager<string> {
  private template: string[][] = [];

  constructor() {
    // Start with empty layout
  }

  // Viewport query operations
  getViewportAt(position: ViewportPosition): string | null {
    if (this.template.length === 0) return null;
    if (position.row >= this.template.length || position.column >= this.template[0].length) return null;
    if (position.row < 0 || position.column < 0) return null;
    return this.template[position.row][position.column];
  }

  getAllViewports(): string[] {
    return this.template.flat().filter(panel => panel !== null);
  }

  getViewportCount(): number {
    return this.getAllViewports().length;
  }

  getLayoutSize() {
    if (this.template.length === 0) {
      return { rows: 0, columns: 0 };
    }
    return {
      rows: this.template.length,
      columns: this.template[0]?.length || 0
    };
  }

  getLayoutTemplate(): string[][] {
    return this.template.map(row => [...row]); // Deep copy
  }

  getViewportBounds(panelId: string) {
    // Find the panel in the template
    for (let row = 0; row < this.template.length; row++) {
      for (let col = 0; col < this.template[row].length; col++) {
        if (this.template[row][col] === panelId) {
          return {
            name: panelId,
            rowStart: row,
            rowEnd: row + 1,
            columnStart: col,
            columnEnd: col + 1
          };
        }
      }
    }
    return null;
  }

  // Single viewport operations
  splitViewport(position: ViewportPosition, newPanelId: string, direction: 'horizontal' | 'vertical'): LayoutManager<string> {
    throw new Error('splitViewport not yet implemented');
  }

  removeViewport(position: ViewportPosition): LayoutManager<string> {
    throw new Error('removeViewport not yet implemented');
  }

  swapViewports(panelId1: string, panelId2: string): LayoutManager<string> {
    throw new Error('swapViewports not yet implemented');
  }

  // Multi-viewport operations - direction is optional for empty layout
  insertViewport(viewportPositions: ViewportPosition[], newPanelId: string, direction?: 'above' | 'below' | 'left' | 'right'): LayoutManager<string> {
    const newManager = new SimpleLayoutManager();
    
    // Special case: empty layout
    if (this.template.length === 0) {
      newManager.template = [[newPanelId]];
      return newManager;
    }
    
    throw new Error('insertViewport for non-empty layouts not yet implemented');
  }

  // Utility operations
  isValidPosition(position: ViewportPosition): boolean {
    const size = this.getLayoutSize();
    return position.row >= 0 && position.row < size.rows && 
           position.column >= 0 && position.column < size.columns;
  }

  getPositionForPanel(panelId: string): ViewportPosition | null {
    for (let row = 0; row < this.template.length; row++) {
      for (let col = 0; col < this.template[row].length; col++) {
        if (this.template[row][col] === panelId) {
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

/**
 * Factory function to create a new workspace
 * 
 * @param id - Unique identifier for the workspace
 * @param position - Screen bounds for the workspace
 * @returns New workspace instance
 */
export function createWorkspace(id: string, position: ScreenBounds): Workspace {
  return {
    id,
    position,
    layout: new SimpleLayoutManager()
  };
}

/**
 * Factory function to create a new viewport
 * 
 * @param panelId - Unique identifier for the panel
 * @param gridPosition - Position in the grid
 * @param screenBounds - Screen coordinates and dimensions
 * @returns New viewport instance
 */
export function createViewport(panelId: string, gridPosition: ViewportPosition, screenBounds: ScreenBounds): Viewport {
  return {
    panelId,
    gridPosition,
    screenBounds
  };
}

/**
 * Helper function to calculate screen bounds from workspace and grid position
 * 
 * @param workspace - The workspace containing the viewport
 * @param gridPosition - Position in the grid
 * @param gridSize - Current grid dimensions
 * @returns Screen bounds for the viewport
 */
export function calculateScreenBounds(workspace: Workspace, gridPosition: ViewportPosition, gridSize: { rows: number; columns: number }): ScreenBounds {
  const cellWidth = workspace.position.width / gridSize.columns;
  const cellHeight = workspace.position.height / gridSize.rows;
  
  return {
    x: workspace.position.x + (gridPosition.column * cellWidth),
    y: workspace.position.y + (gridPosition.row * cellHeight),
    width: cellWidth,
    height: cellHeight
  };
}
