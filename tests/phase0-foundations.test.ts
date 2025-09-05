/**
 * Phase 0: Foundational Tests
 * 
 * Tests the basic building blocks before complex operations:
 * 1. Workspace creation (id, position, empty layout)
 * 2. Viewport creation and properties
 * 3. First viewport insertion (empty → single viewport spanning full space)
 * 
 * This establishes the foundation for all other layout operations.
 */

import { LayoutTree } from '../src/LayoutTree';
import { 
  LayoutManager, 
  ViewportPosition, 
  LayoutSize, 
  ViewportBounds
} from '../src/interfaces/LayoutManager';

// Core interfaces for workspace management
interface ScreenBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Workspace {
  id: string;
  position: ScreenBounds;
  layout: LayoutManager<string>;
}

interface Viewport {
  panelId: string;
  gridPosition: ViewportPosition;
  screenBounds: ScreenBounds;
}

// TODO: This will be the actual implementation
class LayoutTreeManager implements LayoutManager<string> {
  private tree: LayoutTree<string> | null = null;
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

  getLayoutSize(): LayoutSize {
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

  getViewportBounds(panelId: string): ViewportBounds | null {
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
    const newManager = new LayoutTreeManager();
    
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

// Factory functions (TypeScript convention: functions for simple creation)
function createWorkspace(id: string, position: ScreenBounds): Workspace {
  return {
    id,
    position,
    layout: new LayoutTreeManager()
  };
}

function createViewport(panelId: string, gridPosition: ViewportPosition, screenBounds: ScreenBounds): Viewport {
  return {
    panelId,
    gridPosition,
    screenBounds
  };
}

// Helper function to calculate screen bounds from workspace and grid position
function calculateScreenBounds(workspace: Workspace, gridPosition: ViewportPosition, gridSize: LayoutSize): ScreenBounds {
  const cellWidth = workspace.position.width / gridSize.columns;
  const cellHeight = workspace.position.height / gridSize.rows;
  
  return {
    x: workspace.position.x + (gridPosition.column * cellWidth),
    y: workspace.position.y + (gridPosition.row * cellHeight),
    width: cellWidth,
    height: cellHeight
  };
}

/**
 * Phase 0: Foundational Tests
 * 
 * Test the basic building blocks before complex operations.
 */
describe('Phase 0: Foundational Tests', () => {
  
  describe('Workspace Factory', () => {
    test('creates workspace with id, position, and empty layout', () => {
      const workspace = createWorkspace('ws1', { x: 100, y: 200, width: 800, height: 600 });
      
      expect(workspace.id).toBe('ws1');
      expect(workspace.position).toEqual({ x: 100, y: 200, width: 800, height: 600 });
      expect(workspace.layout.getViewportCount()).toBe(0);
      expect(workspace.layout.getLayoutSize()).toEqual({ rows: 0, columns: 0 });
    });

    test('creates workspace with different dimensions', () => {
      const workspace = createWorkspace('ws2', { x: 0, y: 0, width: 1920, height: 1080 });
      
      expect(workspace.id).toBe('ws2');
      expect(workspace.position.width).toBe(1920);
      expect(workspace.position.height).toBe(1080);
      expect(workspace.layout.getViewportCount()).toBe(0);
    });
  });

  describe('Viewport Factory', () => {
    test('creates viewport with correct properties', () => {
      const gridPosition = { row: 0, column: 0 };
      const screenBounds = { x: 0, y: 0, width: 400, height: 300 };
      const viewport = createViewport('panel1', gridPosition, screenBounds);
      
      expect(viewport.panelId).toBe('panel1');
      expect(viewport.gridPosition).toEqual({ row: 0, column: 0 });
      expect(viewport.screenBounds).toEqual({ x: 0, y: 0, width: 400, height: 300 });
    });

    test('creates viewport with different positions', () => {
      const viewport = createViewport('panel2', { row: 1, column: 2 }, { x: 100, y: 200, width: 300, height: 400 });
      
      expect(viewport.panelId).toBe('panel2');
      expect(viewport.gridPosition).toEqual({ row: 1, column: 2 });
      expect(viewport.screenBounds.x).toBe(100);
      expect(viewport.screenBounds.y).toBe(200);
    });
  });

  describe('First Viewport Insertion', () => {
    test('inserting into empty layout creates single viewport spanning full space', () => {
      const workspace = createWorkspace('ws1', { x: 0, y: 0, width: 800, height: 600 });
      
      // Initially empty
      expect(workspace.layout.getViewportCount()).toBe(0);
      expect(workspace.layout.getLayoutSize()).toEqual({ rows: 0, columns: 0 });
      
      // Insert first viewport (direction optional for empty layout)
      const newLayout = workspace.layout.insertViewport([], 'panel1');
      
      // Should create 1x1 grid with viewport spanning full space
      expect(newLayout.getViewportCount()).toBe(1);
      expect(newLayout.getLayoutSize()).toEqual({ rows: 1, columns: 1 });
      expect(newLayout.getViewportAt({ row: 0, column: 0 })).toBe('panel1');
      
      // Viewport should span full grid (1x1)
      const bounds = newLayout.getViewportBounds('panel1');
      expect(bounds).toEqual({
        name: 'panel1',
        rowStart: 0, rowEnd: 1,
        columnStart: 0, columnEnd: 1
      });
    });

    test('can find panel position after insertion', () => {
      const workspace = createWorkspace('ws1', { x: 0, y: 0, width: 800, height: 600 });
      const newLayout = workspace.layout.insertViewport([], 'panel1');
      
      const position = newLayout.getPositionForPanel('panel1');
      expect(position).toEqual({ row: 0, column: 0 });
      
      const nonExistentPosition = newLayout.getPositionForPanel('nonexistent');
      expect(nonExistentPosition).toBe(null);
    });

    test('screen bounds calculation for full workspace viewport', () => {
      const workspace = createWorkspace('ws1', { x: 100, y: 200, width: 800, height: 600 });
      const newLayout = workspace.layout.insertViewport([], 'panel1');
      
      const gridSize = newLayout.getLayoutSize();
      const gridPosition = { row: 0, column: 0 };
      const screenBounds = calculateScreenBounds(workspace, gridPosition, gridSize);
      
      // Should match workspace bounds exactly (1x1 grid)
      expect(screenBounds).toEqual({
        x: 100, y: 200, width: 800, height: 600
      });
    });
  });
});
