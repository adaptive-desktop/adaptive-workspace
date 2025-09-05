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
    leading: 'panel1',
    trailing: 'panel2',
  };

  const complexTree: LayoutParent<string> = {
    direction: 'row',
    leading: 'panel1',
    trailing: {
      direction: 'column',
      leading: 'panel2',
      trailing: {
        direction: 'row',
        leading: 'panel3',
        trailing: 'panel4',
      },
    },
  };

  describe('findPanelPath', () => {
    it('should find panel in simple tree', () => {
      expect(findPanelPath(simpleTree, 'panel1')).toEqual(['leading']);
      expect(findPanelPath(simpleTree, 'panel2')).toEqual(['trailing']);
    });

    it('should find panel in complex tree', () => {
      expect(findPanelPath(complexTree, 'panel1')).toEqual(['leading']);
      expect(findPanelPath(complexTree, 'panel2')).toEqual(['trailing', 'leading']);
      expect(findPanelPath(complexTree, 'panel3')).toEqual(['trailing', 'trailing', 'leading']);
      expect(findPanelPath(complexTree, 'panel4')).toEqual(['trailing', 'trailing', 'trailing']);
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
        leading: 1,
        trailing: 2,
      };
      expect(findPanelPath(numberTree, 1)).toEqual(['leading']);
      expect(findPanelPath(numberTree, 2)).toEqual(['trailing']);
      expect(findPanelPath(numberTree, 3)).toBe(null);
    });

    it('should handle deeply nested structures', () => {
      const deepTree: LayoutParent<string> = {
        direction: 'row',
        leading: {
          direction: 'column',
          leading: {
            direction: 'row',
            leading: 'deep-panel',
            trailing: 'other',
          },
          trailing: 'panel2',
        },
        trailing: 'panel3',
      };
      expect(findPanelPath(deepTree, 'deep-panel')).toEqual(['leading', 'leading', 'leading']);
    });

    it('should handle duplicate panel IDs (returns first occurrence)', () => {
      const duplicateTree: LayoutParent<string> = {
        direction: 'row',
        leading: 'duplicate',
        trailing: {
          direction: 'column',
          leading: 'duplicate',
          trailing: 'other',
        },
      };
      // Should return the first occurrence found (depth-first search)
      expect(findPanelPath(duplicateTree, 'duplicate')).toEqual(['leading']);
    });
  });

  describe('getAndAssertNodeAtPathExists', () => {
    it('should return node at valid path', () => {
      expect(getAndAssertNodeAtPathExists(simpleTree, ['leading'])).toBe('panel1');
      expect(getAndAssertNodeAtPathExists(simpleTree, ['trailing'])).toBe('panel2');
      expect(getAndAssertNodeAtPathExists(simpleTree, [])).toBe(simpleTree);
    });

    it('should return node at complex path', () => {
      expect(getAndAssertNodeAtPathExists(complexTree, ['trailing', 'leading'])).toBe('panel2');
      expect(getAndAssertNodeAtPathExists(complexTree, ['trailing', 'trailing', 'leading'])).toBe('panel3');
    });

    it('should throw error for null tree', () => {
      expect(() => {
        getAndAssertNodeAtPathExists(null, ['leading']);
      }).toThrow('Cannot navigate path leading: tree is null');
    });

    it('should throw error for invalid path', () => {
      expect(() => {
        getAndAssertNodeAtPathExists(simpleTree, ['invalid' as any]);
      }).toThrow('Path invalid does not exist in the tree');
    });

    it('should throw error for non-existent path', () => {
      expect(() => {
        getAndAssertNodeAtPathExists(simpleTree, ['leading', 'trailing']);
      }).toThrow('Path leading/trailing does not exist in the tree');
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
      expect(tree.leading).toBe('panel1');
      expect(tree.trailing).toBe('panel2');
      expect(tree.splitPercentage).toBe(50);
    });

    it('should create balanced tree for three panels', () => {
      const tree = createBalancedTreeFromLeaves(['panel1', 'panel2', 'panel3']) as LayoutParent<string>;
      expect(tree.direction).toBe('row');

      // For 3 panels, Math.ceil(3/2) = 2, so split is [panel1, panel2] and [panel3]
      const leadingChild = tree.leading as LayoutParent<string>;
      expect(leadingChild.direction).toBe('row');
      expect(leadingChild.leading).toBe('panel1');
      expect(leadingChild.trailing).toBe('panel2');

      expect(tree.trailing).toBe('panel3');
    });

    it('should create balanced tree for four panels', () => {
      const tree = createBalancedTreeFromLeaves(['panel1', 'panel2', 'panel3', 'panel4']) as LayoutParent<string>;
      expect(tree.direction).toBe('row');
      
      const leadingChild = tree.leading as LayoutParent<string>;
      expect(leadingChild.direction).toBe('row');
      expect(leadingChild.leading).toBe('panel1');
      expect(leadingChild.trailing).toBe('panel2');
      
      const trailingChild = tree.trailing as LayoutParent<string>;
      expect(trailingChild.direction).toBe('row');
      expect(trailingChild.leading).toBe('panel3');
      expect(trailingChild.trailing).toBe('panel4');
    });

    it('should use specified direction', () => {
      const tree = createBalancedTreeFromLeaves(['panel1', 'panel2'], 'column') as LayoutParent<string>;
      expect(tree.direction).toBe('column');
      expect(tree.leading).toBe('panel1');
      expect(tree.trailing).toBe('panel2');
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
      const leadingChild = tree.leading as LayoutParent<number>;
      expect(leadingChild.leading).toBe(1);
      expect(leadingChild.trailing).toBe(2);

      expect(tree.trailing).toBe(3);
    });
  });

  describe('isValidPath', () => {
    it('should accept valid paths', () => {
      expect(isValidPath([])).toBe(true);
      expect(isValidPath(['leading'])).toBe(true);
      expect(isValidPath(['trailing'])).toBe(true);
      expect(isValidPath(['leading', 'trailing'])).toBe(true);
      expect(isValidPath(['trailing', 'leading', 'trailing'])).toBe(true);
    });

    it('should reject invalid paths', () => {
      expect(isValidPath(['invalid' as any])).toBe(false);
      expect(isValidPath(['leading', 'invalid' as any])).toBe(false);
      expect(isValidPath(['invalid' as any, 'leading'])).toBe(false);
    });

    it('should handle mixed valid and invalid', () => {
      expect(isValidPath(['leading', 'trailing', 'invalid' as any])).toBe(false);
    });
  });

  describe('getAllPaths', () => {
    it('should return all paths for simple tree', () => {
      const paths = getAllPaths(simpleTree);
      expect(paths).toContainEqual([]);
      expect(paths).toContainEqual(['leading']);
      expect(paths).toContainEqual(['trailing']);
      expect(paths.length).toBe(3);
    });

    it('should return all paths for complex tree', () => {
      const paths = getAllPaths(complexTree);
      expect(paths).toContainEqual([]);
      expect(paths).toContainEqual(['leading']);
      expect(paths).toContainEqual(['trailing']);
      expect(paths).toContainEqual(['trailing', 'leading']);
      expect(paths).toContainEqual(['trailing', 'trailing']);
      expect(paths).toContainEqual(['trailing', 'trailing', 'leading']);
      expect(paths).toContainEqual(['trailing', 'trailing', 'trailing']);
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
        leading: 'panel1',
        trailing: {
          direction: 'column',
          leading: {
            direction: 'row',
            leading: {
              direction: 'column',
              leading: 'deep',
              trailing: 'panel',
            },
            trailing: 'other',
          },
          trailing: 'panel2',
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

  return getAllLeaves(tree.leading).concat(getAllLeaves(tree.trailing));
}
