/**
 * @fileoverview Tests for path navigation utilities
 *
 * These tests verify the path navigation functions for finding panels,
 * validating paths, and creating balanced tree structures.
 */

import {
  findPanelPath,
  getAndAssertNodeAtPathExists,
  createBalancedTreeFromLeaves,
  isValidPath,
  getAllPaths,
  getTreeDepth,
} from '../src/utils/pathUtils';
import { LayoutParent, LayoutNode, LayoutPath } from '../src/types';

describe('Path Utilities', () => {
  // Sample tree structures for testing
  const simpleTree: LayoutParent<string> = {
    direction: 'row',
    first: 'panel1',
    second: 'panel2',
  };

  const complexTree: LayoutParent<string> = {
    direction: 'row',
    first: 'panel1',
    second: {
      direction: 'column',
      first: 'panel2',
      second: {
        direction: 'row',
        first: 'panel3',
        second: 'panel4',
      },
    },
  };

  describe('findPanelPath', () => {
    it('should find panel in simple tree', () => {
      expect(findPanelPath(simpleTree, 'panel1')).toEqual(['first']);
      expect(findPanelPath(simpleTree, 'panel2')).toEqual(['second']);
    });

    it('should find panel in complex tree', () => {
      expect(findPanelPath(complexTree, 'panel1')).toEqual(['first']);
      expect(findPanelPath(complexTree, 'panel2')).toEqual(['second', 'first']);
      expect(findPanelPath(complexTree, 'panel3')).toEqual(['second', 'second', 'first']);
      expect(findPanelPath(complexTree, 'panel4')).toEqual(['second', 'second', 'second']);
    });

    it('should return null for non-existent panel', () => {
      expect(findPanelPath(simpleTree, 'nonexistent')).toBe(null);
      expect(findPanelPath(complexTree, 'missing')).toBe(null);
    });

    it('should handle null tree', () => {
      expect(findPanelPath(null, 'panel1')).toBe(null);
    });

    it('should handle single panel tree', () => {
      expect(findPanelPath('panel1', 'panel1')).toEqual([]);
      expect(findPanelPath('panel1', 'panel2')).toBe(null);
    });

    it('should handle number panel IDs', () => {
      const numberTree: LayoutParent<number> = {
        direction: 'row',
        first: 1,
        second: 2,
      };
      expect(findPanelPath(numberTree, 1)).toEqual(['first']);
      expect(findPanelPath(numberTree, 2)).toEqual(['second']);
      expect(findPanelPath(numberTree, 3)).toBe(null);
    });

    it('should handle deeply nested structures', () => {
      const deepTree: LayoutParent<string> = {
        direction: 'row',
        first: {
          direction: 'column',
          first: {
            direction: 'row',
            first: 'deep-panel',
            second: 'other',
          },
          second: 'panel2',
        },
        second: 'panel3',
      };
      expect(findPanelPath(deepTree, 'deep-panel')).toEqual(['first', 'first', 'first']);
    });

    it('should handle duplicate panel IDs (returns first occurrence)', () => {
      const duplicateTree: LayoutParent<string> = {
        direction: 'row',
        first: 'duplicate',
        second: {
          direction: 'column',
          first: 'duplicate',
          second: 'other',
        },
      };
      // Should return the first occurrence found (depth-first search)
      expect(findPanelPath(duplicateTree, 'duplicate')).toEqual(['first']);
    });
  });

  describe('getAndAssertNodeAtPathExists', () => {
    it('should return node at valid path', () => {
      expect(getAndAssertNodeAtPathExists(simpleTree, ['first'])).toBe('panel1');
      expect(getAndAssertNodeAtPathExists(simpleTree, ['second'])).toBe('panel2');
      expect(getAndAssertNodeAtPathExists(simpleTree, [])).toBe(simpleTree);
    });

    it('should return node at complex path', () => {
      expect(getAndAssertNodeAtPathExists(complexTree, ['second', 'first'])).toBe('panel2');
      expect(getAndAssertNodeAtPathExists(complexTree, ['second', 'second', 'first'])).toBe('panel3');
    });

    it('should throw error for null tree', () => {
      expect(() => {
        getAndAssertNodeAtPathExists(null, ['first']);
      }).toThrow('Cannot navigate path first: tree is null');
    });

    it('should throw error for invalid path', () => {
      expect(() => {
        getAndAssertNodeAtPathExists(simpleTree, ['invalid' as any]);
      }).toThrow('Path invalid does not exist in the tree');
    });

    it('should throw error for non-existent path', () => {
      expect(() => {
        getAndAssertNodeAtPathExists(simpleTree, ['first', 'second']);
      }).toThrow('Path first/second does not exist in the tree');
    });

    it('should handle empty path', () => {
      expect(getAndAssertNodeAtPathExists(simpleTree, [])).toBe(simpleTree);
    });
  });

  describe('createBalancedTreeFromLeaves', () => {
    it('should return null for empty array', () => {
      expect(createBalancedTreeFromLeaves([])).toBe(null);
    });

    it('should return single panel for single element', () => {
      expect(createBalancedTreeFromLeaves(['panel1'])).toBe('panel1');
    });

    it('should create balanced tree for two panels', () => {
      const tree = createBalancedTreeFromLeaves(['panel1', 'panel2']) as LayoutParent<string>;
      expect(tree.direction).toBe('row');
      expect(tree.first).toBe('panel1');
      expect(tree.second).toBe('panel2');
      expect(tree.splitPercentage).toBe(50);
    });

    it('should create balanced tree for three panels', () => {
      const tree = createBalancedTreeFromLeaves(['panel1', 'panel2', 'panel3']) as LayoutParent<string>;
      expect(tree.direction).toBe('row');

      // For 3 panels, Math.ceil(3/2) = 2, so split is [panel1, panel2] and [panel3]
      const firstChild = tree.first as LayoutParent<string>;
      expect(firstChild.direction).toBe('row');
      expect(firstChild.first).toBe('panel1');
      expect(firstChild.second).toBe('panel2');

      expect(tree.second).toBe('panel3');
    });

    it('should create balanced tree for four panels', () => {
      const tree = createBalancedTreeFromLeaves(['panel1', 'panel2', 'panel3', 'panel4']) as LayoutParent<string>;
      expect(tree.direction).toBe('row');
      
      const firstChild = tree.first as LayoutParent<string>;
      expect(firstChild.direction).toBe('row');
      expect(firstChild.first).toBe('panel1');
      expect(firstChild.second).toBe('panel2');
      
      const secondChild = tree.second as LayoutParent<string>;
      expect(secondChild.direction).toBe('row');
      expect(secondChild.first).toBe('panel3');
      expect(secondChild.second).toBe('panel4');
    });

    it('should use specified direction', () => {
      const tree = createBalancedTreeFromLeaves(['panel1', 'panel2'], 'column') as LayoutParent<string>;
      expect(tree.direction).toBe('column');
      expect(tree.first).toBe('panel1');
      expect(tree.second).toBe('panel2');
    });

    it('should handle larger arrays', () => {
      const panels = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'];
      const tree = createBalancedTreeFromLeaves(panels);
      
      // Verify all panels are present
      const allPanels = getAllLeaves(tree);
      expect(allPanels.sort()).toEqual(panels.sort());
    });

    it('should create reasonably balanced trees', () => {
      const panels = ['p1', 'p2', 'p3', 'p4', 'p5'];
      const tree = createBalancedTreeFromLeaves(panels);
      const depth = getTreeDepth(tree);
      
      // For 5 panels, depth should be reasonable (not linear)
      expect(depth).toBeLessThanOrEqual(3);
    });

    it('should handle number panel IDs', () => {
      const tree = createBalancedTreeFromLeaves([1, 2, 3]) as LayoutParent<number>;

      // For 3 panels, split is [1, 2] and [3]
      const firstChild = tree.first as LayoutParent<number>;
      expect(firstChild.first).toBe(1);
      expect(firstChild.second).toBe(2);

      expect(tree.second).toBe(3);
    });
  });

  describe('isValidPath', () => {
    it('should accept valid paths', () => {
      expect(isValidPath([])).toBe(true);
      expect(isValidPath(['first'])).toBe(true);
      expect(isValidPath(['second'])).toBe(true);
      expect(isValidPath(['first', 'second'])).toBe(true);
      expect(isValidPath(['second', 'first', 'second'])).toBe(true);
    });

    it('should reject invalid paths', () => {
      expect(isValidPath(['invalid' as any])).toBe(false);
      expect(isValidPath(['first', 'invalid' as any])).toBe(false);
      expect(isValidPath(['invalid' as any, 'first'])).toBe(false);
    });

    it('should handle mixed valid and invalid', () => {
      expect(isValidPath(['first', 'second', 'invalid' as any])).toBe(false);
    });
  });

  describe('getAllPaths', () => {
    it('should return all paths for simple tree', () => {
      const paths = getAllPaths(simpleTree);
      expect(paths).toContainEqual([]);
      expect(paths).toContainEqual(['first']);
      expect(paths).toContainEqual(['second']);
      expect(paths.length).toBe(3);
    });

    it('should return all paths for complex tree', () => {
      const paths = getAllPaths(complexTree);
      expect(paths).toContainEqual([]);
      expect(paths).toContainEqual(['first']);
      expect(paths).toContainEqual(['second']);
      expect(paths).toContainEqual(['second', 'first']);
      expect(paths).toContainEqual(['second', 'second']);
      expect(paths).toContainEqual(['second', 'second', 'first']);
      expect(paths).toContainEqual(['second', 'second', 'second']);
      expect(paths.length).toBe(7);
    });

    it('should handle single panel', () => {
      const paths = getAllPaths('panel1');
      expect(paths).toEqual([[]]);
    });

    it('should handle null tree', () => {
      const paths = getAllPaths(null);
      expect(paths).toEqual([]);
    });

    it('should respect max depth', () => {
      const paths = getAllPaths(complexTree, 2);
      // Should not include paths longer than 2
      const longPaths = paths.filter(path => path.length > 2);
      expect(longPaths.length).toBe(0);
    });

    it('should handle max depth of 0', () => {
      const paths = getAllPaths(complexTree, 0);
      expect(paths).toEqual([]);
    });
  });

  describe('getTreeDepth', () => {
    it('should return -1 for null tree', () => {
      expect(getTreeDepth(null)).toBe(-1);
    });

    it('should return 0 for single panel', () => {
      expect(getTreeDepth('panel1')).toBe(0);
    });

    it('should return 1 for simple tree', () => {
      expect(getTreeDepth(simpleTree)).toBe(1);
    });

    it('should return correct depth for complex tree', () => {
      expect(getTreeDepth(complexTree)).toBe(3);
    });

    it('should handle unbalanced trees', () => {
      const unbalancedTree: LayoutParent<string> = {
        direction: 'row',
        first: 'panel1',
        second: {
          direction: 'column',
          first: {
            direction: 'row',
            first: {
              direction: 'column',
              first: 'deep',
              second: 'panel',
            },
            second: 'other',
          },
          second: 'panel2',
        },
      };
      expect(getTreeDepth(unbalancedTree)).toBe(4);
    });
  });
});

// Helper function to get all leaves from a tree (for testing)
function getAllLeaves<T extends string | number>(tree: LayoutNode<T> | null): T[] {
  if (tree === null) {
    return [];
  }

  if (typeof tree !== 'object' || !('direction' in tree)) {
    return [tree];
  }

  return getAllLeaves(tree.first).concat(getAllLeaves(tree.second));
}
