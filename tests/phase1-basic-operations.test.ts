/**
 * @fileoverview Phase 1: Basic Operations Test Suite
 *
 * IMPORTANT: These tests define WHAT we want the layout system to do.
 * They will fail until we implement the coordinate-based methods.
 *
 * This is Test-Driven Development:
 * 1. Define the expected behavior in tests (this file)
 * 2. Run tests (they will fail)
 * 3. Implement the minimum code to make tests pass
 * 4. Refactor and improve
 *
 * Tests focus on LAYOUT RESULTS, not tree implementation details.
 * The binary tree is just record-keeping - what matters is where regions end up.
 *
 * Initial Grid Layout:
 * ┌───┬───┬───┬───┐
 * │ A │ B │ C │ D │
 * ├───┼───┼───┼───┤
 * │ E │ F │ G │ H │
 * ├───┼───┼───┼───┤
 * │ I │ J │ K │ L │
 * ├───┼───┼───┼───┤
 * │ M │ N │ O │ P │
 * └───┴───┴───┴───┘
 *
 * KEY DECISIONS NEEDED TO MAKE TESTS PASS:
 * 1. How to build a 4x4 tree from grid layout
 * 2. How to map coordinates (row, col) to tree paths
 * 3. How to implement coordinate-based operations
 * 4. How to track grid dimensions
 * 5. How to handle edge cases and errors
 */

import { LayoutTree } from '../src/LayoutTree';
import {
  LayoutManager,
  ViewportPosition,
  LayoutSize,
  ViewportBounds
} from '../src/interfaces/LayoutManager';

// TODO: This will be implemented by extending LayoutTree with viewport-based methods
// For now, we'll create a placeholder that shows what we expect to test
class LayoutTreeManager implements LayoutManager<string> {
  private tree: LayoutTree<string>;
  private template: string[][];

  constructor(initialTemplate: string[][]) {
    this.template = initialTemplate.map(row => [...row]); // Deep copy
    // TODO: Build tree from layout template
    this.tree = this.buildTreeFromTemplate(initialTemplate);
  }

  // Viewport query operations
  getViewportAt(position: ViewportPosition): string | null {
    throw new Error('getViewportAt not yet implemented - needs position to path mapping');
  }

  getAllViewports(): string[] {
    return this.tree.getPanelIds();
  }

  getViewportCount(): number {
    return this.tree.getPanelCount();
  }

  getLayoutSize(): LayoutSize {
    return {
      rows: this.template.length,
      columns: this.template[0]?.length || 0
    };
  }

  getLayoutTemplate(): string[][] {
    return this.template.map(row => [...row]); // Deep copy
  }

  getViewportBounds(panelId: string): ViewportBounds | null {
    throw new Error('getViewportBounds not yet implemented');
  }

  // Single viewport operations
  splitViewport(position: ViewportPosition, newPanelId: string, direction: 'horizontal' | 'vertical'): LayoutManager<string> {
    throw new Error('splitViewport not yet implemented - needs viewport splitting');
  }

  removeViewport(position: ViewportPosition): LayoutManager<string> {
    throw new Error('removeViewport not yet implemented - needs viewport removal (adjacent viewports expand proportionally)');
  }

  swapViewports(panelId1: string, panelId2: string): LayoutManager<string> {
    throw new Error('swapViewports not yet implemented - needs viewport swapping (clean exchange, no displacement)');
  }

  // Multi-viewport operations
  insertViewport(viewportPositions: ViewportPosition[], newPanelId: string, direction: 'above' | 'below' | 'left' | 'right'): LayoutManager<string> {
    throw new Error('insertViewport not yet implemented - needs viewport insertion at specified range and direction');
  }

  // Utility operations
  isValidPosition(position: ViewportPosition): boolean {
    const size = this.getLayoutSize();
    return position.row >= 0 && position.row < size.rows &&
           position.column >= 0 && position.column < size.columns;
  }

  getPositionForPanel(panelId: string): ViewportPosition | null {
    throw new Error('getPositionForPanel not yet implemented');
  }

  canSplitViewport(position: ViewportPosition): boolean {
    throw new Error('canSplitViewport not yet implemented');
  }

  canRemoveViewport(position: ViewportPosition): boolean {
    throw new Error('canRemoveViewport not yet implemented');
  }

  private buildTreeFromTemplate(template: string[][]): LayoutTree<string> {
    throw new Error('buildTreeFromTemplate not yet implemented - needs tree construction strategy');
  }
}

// Test helper functions
function create4x4Layout(): LayoutManager<string> {
  const initialTemplate = [
    ['A', 'B', 'C', 'D'],
    ['E', 'F', 'G', 'H'],
    ['I', 'J', 'K', 'L'],
    ['M', 'N', 'O', 'P']
  ];
  return new LayoutTreeManager(initialTemplate);
}

function expectLayoutTemplateToMatch(layout: LayoutManager<string>, expected: string[][]): void {
  const actual = layout.getLayoutTemplate();
  expect(actual).toEqual(expected);

  // Also verify individual viewport positions
  for (let row = 0; row < expected.length; row++) {
    for (let col = 0; col < expected[row].length; col++) {
      expect(layout.getViewportAt({ row, column: col })).toBe(expected[row][col]);
    }
  }
}

/**
 * Phase 1: Viewport Layout Test Suite
 *
 * These tests define WHAT we want the layout system to do.
 * They will fail until we implement the viewport-based methods.
 *
 * The goal is to define the expected behavior first, then implement to make tests pass.
 */
describe('Phase 1: Viewport Layout Testing', () => {
  let layout: LayoutManager<string>;

  beforeEach(() => {
    layout = create4x4Layout();
  });

  describe('Layout Template Validation', () => {
    test('4x4 layout has correct initial template', () => {
      expectLayoutTemplateToMatch(layout, [
        ['A', 'B', 'C', 'D'],
        ['E', 'F', 'G', 'H'],
        ['I', 'J', 'K', 'L'],
        ['M', 'N', 'O', 'P']
      ]);

      expect(layout.getViewportCount()).toBe(16);
      expect(layout.getLayoutSize()).toEqual({ rows: 4, columns: 4 });
    });

    test('Can access all viewports by position', () => {
      expect(layout.getViewportAt({ row: 0, column: 0 })).toBe('A');
      expect(layout.getViewportAt({ row: 0, column: 3 })).toBe('D');
      expect(layout.getViewportAt({ row: 3, column: 0 })).toBe('M');
      expect(layout.getViewportAt({ row: 3, column: 3 })).toBe('P');
      expect(layout.getViewportAt({ row: 1, column: 1 })).toBe('F');
    });

    test('Invalid positions return null', () => {
      expect(layout.getViewportAt({ row: -1, column: 0 })).toBe(null);
      expect(layout.getViewportAt({ row: 0, column: -1 })).toBe(null);
      expect(layout.getViewportAt({ row: 4, column: 0 })).toBe(null);
      expect(layout.getViewportAt({ row: 0, column: 4 })).toBe(null);
    });

    test('Layout template is immutable', () => {
      const template1 = layout.getLayoutTemplate();
      const template2 = layout.getLayoutTemplate();

      // Should be equal but not the same reference
      expect(template1).toEqual(template2);
      expect(template1).not.toBe(template2);

      // Modifying returned template shouldn't affect layout
      template1[0][0] = 'MODIFIED';
      expect(layout.getViewportAt({ row: 0, column: 0 })).toBe('A');
    });
  });

  describe('Region Addition (Splitting)', () => {
    test('Split corner region A horizontally', () => {
      // Split A horizontally - adds new row below A
      const newLayout = layout.splitRegion({ row: 0, column: 0 }, 'A1', 'horizontal');

      expectLayoutToMatch(newLayout, [
        ['A', 'B', 'C', 'D'],
        ['A1', 'A1', 'A1', 'A1'], // New row added
        ['E', 'F', 'G', 'H'],
        ['I', 'J', 'K', 'L'],
        ['M', 'N', 'O', 'P']
      ]);

      expect(newLayout.getRegionCount()).toBe(20); // Was 16, now 20
      expect(newLayout.getGridSize()).toEqual({ rows: 5, columns: 4 });
    });

    test('Split center region F vertically', () => {
      // Split F vertically - adds new column to the right of F
      const newLayout = layout.splitRegion({ row: 1, column: 1 }, 'F1', 'vertical');

      expectLayoutToMatch(newLayout, [
        ['A', 'B', 'F1', 'C', 'D'],
        ['E', 'F', 'F1', 'G', 'H'],
        ['I', 'J', 'F1', 'K', 'L'],
        ['M', 'N', 'F1', 'O', 'P']
      ]);

      expect(newLayout.getRegionCount()).toBe(20); // Was 16, now 20
      expect(newLayout.getGridSize()).toEqual({ rows: 4, columns: 5 });
    });

    test('Split edge region B horizontally', () => {
      const newLayout = layout.splitRegion({ row: 0, column: 1 }, 'B1', 'horizontal');

      expectLayoutToMatch(newLayout, [
        ['A', 'B', 'C', 'D'],
        ['B1', 'B1', 'B1', 'B1'], // New row added
        ['E', 'F', 'G', 'H'],
        ['I', 'J', 'K', 'L'],
        ['M', 'N', 'O', 'P']
      ]);

      expect(newLayout.getRegionCount()).toBe(20);
    });
  });

  describe('Region Removal', () => {
    test('Remove corner region A (removes top row)', () => {
      const newLayout = layout.removeRegion({ row: 0, column: 0 });

      expectLayoutToMatch(newLayout, [
        ['E', 'F', 'G', 'H'],
        ['I', 'J', 'K', 'L'],
        ['M', 'N', 'O', 'P']
      ]);

      expect(newLayout.getRegionCount()).toBe(12); // Was 16, now 12
      expect(newLayout.getGridSize()).toEqual({ rows: 3, columns: 4 });
    });

    test('Remove center region F (removes column)', () => {
      const newLayout = layout.removeRegion({ row: 1, column: 1 });

      expectLayoutToMatch(newLayout, [
        ['A', 'C', 'D'],
        ['E', 'G', 'H'],
        ['I', 'K', 'L'],
        ['M', 'O', 'P']
      ]);

      expect(newLayout.getRegionCount()).toBe(12); // Was 16, now 12
      expect(newLayout.getGridSize()).toEqual({ rows: 4, columns: 3 });
    });

    test('Remove last region should fail', () => {
      const singleLayout = new SimpleLayoutManager([['A']]);

      expect(() => {
        singleLayout.removeRegion({ row: 0, column: 0 });
      }).toThrow('Cannot remove the last region');
    });
  });

  describe('Region Movement (Swapping)', () => {
    test('Swap corner regions A and P', () => {
      const newLayout = layout.swapRegions(
        { row: 0, column: 0 }, // Region A
        { row: 3, column: 3 }  // Region P
      );

      expectLayoutToMatch(newLayout, [
        ['P', 'B', 'C', 'D'], // A and P swapped
        ['E', 'F', 'G', 'H'],
        ['I', 'J', 'K', 'L'],
        ['M', 'N', 'O', 'A']  // A is now here
      ]);

      expect(newLayout.getRegionCount()).toBe(16); // Same count, just swapped
    });

    test('Swap adjacent regions A and B', () => {
      const newLayout = layout.swapRegions(
        { row: 0, column: 0 }, // Region A
        { row: 0, column: 1 }  // Region B
      );

      expectLayoutToMatch(newLayout, [
        ['B', 'A', 'C', 'D'], // A and B swapped
        ['E', 'F', 'G', 'H'],
        ['I', 'J', 'K', 'L'],
        ['M', 'N', 'O', 'P']
      ]);

      expect(newLayout.getRegionCount()).toBe(16);
    });

    test('Swap center region F with edge region H', () => {
      const newLayout = layout.swapRegions(
        { row: 1, column: 1 }, // Region F
        { row: 1, column: 3 }  // Region H
      );

      expectLayoutToMatch(newLayout, [
        ['A', 'B', 'C', 'D'],
        ['E', 'H', 'G', 'F'], // F and H swapped
        ['I', 'J', 'K', 'L'],
        ['M', 'N', 'O', 'P']
      ]);

      expect(newLayout.getRegionCount()).toBe(16);
    });

    test('Swap diagonal regions B and O', () => {
      const newLayout = layout.swapRegions(
        { row: 0, column: 1 }, // Region B
        { row: 3, column: 2 }  // Region O
      );

      expectLayoutToMatch(newLayout, [
        ['A', 'O', 'C', 'D'], // B and O swapped
        ['E', 'F', 'G', 'H'],
        ['I', 'J', 'K', 'L'],
        ['M', 'N', 'B', 'P']  // B is now here
      ]);

      expect(newLayout.getRegionCount()).toBe(16);
    });

    test('Swap same region should be no-op', () => {
      const newLayout = layout.swapRegions(
        { row: 0, column: 0 }, // Region A
        { row: 0, column: 0 }  // Same region A
      );

      // Should be identical to original
      expectLayoutToMatch(newLayout, [
        ['A', 'B', 'C', 'D'],
        ['E', 'F', 'G', 'H'],
        ['I', 'J', 'K', 'L'],
        ['M', 'N', 'O', 'P']
      ]);
    });
  });

  describe('Error Handling', () => {
    test('Split with invalid coordinates should fail', () => {
      expect(() => {
        layout.splitRegion({ row: -1, column: 0 }, 'X', 'horizontal');
      }).toThrow('Invalid coordinates: row -1, column 0. Expected row 0-3, column 0-3.');

      expect(() => {
        layout.splitRegion({ row: 0, column: 4 }, 'X', 'horizontal');
      }).toThrow('Invalid coordinates: row 0, column 4. Expected row 0-3, column 0-3.');
    });

    test('Remove with invalid coordinates should fail', () => {
      expect(() => {
        layout.removeRegion({ row: 4, column: 0 });
      }).toThrow('Invalid coordinates: row 4, column 0. Expected row 0-3, column 0-3.');
    });

    test('Swap with invalid coordinates should fail', () => {
      expect(() => {
        layout.swapRegions({ row: 0, column: 0 }, { row: -1, column: 0 });
      }).toThrow('Invalid coordinates: row -1, column 0. Expected row 0-3, column 0-3.');
    });

    test('Operations preserve layout integrity', () => {
      // After any operation, all regions should still be accessible
      let currentLayout = layout;

      // Split operation
      currentLayout = currentLayout.splitRegion({ row: 0, column: 0 }, 'A1', 'horizontal');
      expect(currentLayout.getRegionCount()).toBeGreaterThan(0);
      expect(currentLayout.getAllRegions()).not.toContain(null);
      expect(currentLayout.getAllRegions()).not.toContain(undefined);

      // Swap operation
      currentLayout = currentLayout.swapRegions({ row: 0, column: 0 }, { row: 1, column: 0 });
      expect(currentLayout.getRegionCount()).toBeGreaterThan(0);

      // Remove operation (if possible)
      if (currentLayout.getRegionCount() > 1) {
        currentLayout = currentLayout.removeRegion({ row: 0, column: 0 });
        expect(currentLayout.getRegionCount()).toBeGreaterThan(0);
      }
    });
  });

  describe('Layout Immutability', () => {
    test('Original layout unchanged after operations', () => {
      const originalRegions = layout.getAllRegions();

      // Perform operations
      layout.splitRegion({ row: 0, column: 0 }, 'A1', 'horizontal');
      layout.removeRegion({ row: 0, column: 0 });
      layout.swapRegions({ row: 0, column: 0 }, { row: 1, column: 1 });

      // Original should be unchanged
      expect(layout.getAllRegions()).toEqual(originalRegions);
      expect(layout.getRegionAt({ row: 0, column: 0 })).toBe('A');
      expect(layout.getRegionAt({ row: 1, column: 1 })).toBe('F');
    });
  });
});
