/**
 * @fileoverview Tests for tree utility functions
 *
 * These tests verify the utility functions for tree traversal, type checking,
 * and basic tree operations.
 */

import {
  isParent,
  getLeaves,
  getNodeAtPath,
  getOtherBranch,
  getOtherDirection,
  isValidSplitPercentage,
  normalizeSplitPercentage,
} from '../src/utils/treeUtils';
import { LayoutParent, LayoutNode, LayoutPath } from '../src/shared/types';

describe('Tree Utilities', () => {
  // Sample tree structures for testing
  const sampleLeaf: LayoutNode<string> = 'panel1';

  const sampleParent: LayoutParent<string> = {
    direction: 'row',
    leading: 'panel1',
    trailing: 'panel2',
    splitPercentage: 60,
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
        splitPercentage: 25,
      },
      splitPercentage: 75,
    },
    splitPercentage: 40,
  };

  describe('isParent', () => {
    it('should identify parent nodes correctly', () => {
      expect(isParent(sampleParent)).toBe(true);
    });

    it('should identify leaf nodes correctly', () => {
      expect(isParent(sampleLeaf)).toBe(false);
      expect(isParent('panel1')).toBe(false);
      expect(isParent(42)).toBe(false);
    });

    it('should handle null values', () => {
      expect(isParent(null as any)).toBe(false);
    });

    it('should handle undefined values', () => {
      expect(isParent(undefined as any)).toBe(false);
    });

    it('should handle objects without direction property', () => {
      const invalidObject = { leading: 'a', trailing: 'b' };
      expect(isParent(invalidObject as any)).toBe(false);
    });

    it('should handle empty objects', () => {
      expect(isParent({} as any)).toBe(false);
    });

    it('should provide proper type narrowing', () => {
      const node: LayoutNode<string> = sampleParent;
      if (isParent(node)) {
        // TypeScript should know this is a LayoutParent
        expect(node.direction).toBe('row');
        expect(node.leading).toBe('panel1');
        expect(node.trailing).toBe('panel2');
      }
    });
  });

  describe('getLeaves', () => {
    it('should return empty array for null tree', () => {
      expect(getLeaves(null)).toEqual([]);
    });

    it('should return single leaf for leaf node', () => {
      expect(getLeaves('panel1')).toEqual(['panel1']);
      expect(getLeaves(42)).toEqual([42]);
    });

    it('should return leaves from simple parent', () => {
      const leaves = getLeaves(sampleParent);
      expect(leaves).toEqual(['panel1', 'panel2']);
    });

    it('should return leaves from complex tree in depth-first order', () => {
      const leaves = getLeaves(complexTree);
      expect(leaves).toEqual(['panel1', 'panel2', 'panel3', 'panel4']);
    });

    it('should handle single-child scenarios', () => {
      const singleChildTree: LayoutParent<string> = {
        direction: 'row',
        leading: 'panel1',
        trailing: {
          direction: 'column',
          leading: 'panel2',
          trailing: 'panel2', // Duplicate panel ID
        },
      };
      const leaves = getLeaves(singleChildTree);
      expect(leaves).toEqual(['panel1', 'panel2', 'panel2']);
    });

    it('should handle deeply nested structures', () => {
      const deepTree: LayoutParent<number> = {
        direction: 'row',
        leading: {
          direction: 'column',
          leading: {
            direction: 'row',
            leading: 1,
            trailing: 2,
          },
          trailing: 3,
        },
        trailing: 4,
      };
      const leaves = getLeaves(deepTree);
      expect(leaves).toEqual([1, 2, 3, 4]);
    });

    it('should preserve order of traversal', () => {
      const orderedTree: LayoutParent<string> = {
        direction: 'column',
        leading: {
          direction: 'row',
          leading: 'A',
          trailing: 'B',
        },
        trailing: {
          direction: 'row',
          leading: 'C',
          trailing: 'D',
        },
      };
      const leaves = getLeaves(orderedTree);
      expect(leaves).toEqual(['A', 'B', 'C', 'D']);
    });
  });

  describe('getNodeAtPath', () => {
    it('should return root for empty path', () => {
      expect(getNodeAtPath(sampleParent, [])).toBe(sampleParent);
      expect(getNodeAtPath(sampleLeaf, [])).toBe(sampleLeaf);
      expect(getNodeAtPath(null, [])).toBe(null);
    });

    it('should return null for null tree with non-empty path', () => {
      expect(getNodeAtPath(null, ['leading'])).toBe(null);
    });

    it('should return null for invalid path on leaf', () => {
      expect(getNodeAtPath(sampleLeaf, ['leading'])).toBe(null);
      expect(getNodeAtPath('panel1', ['trailing'])).toBe(null);
    });

    it('should navigate simple parent correctly', () => {
      expect(getNodeAtPath(sampleParent, ['leading'])).toBe('panel1');
      expect(getNodeAtPath(sampleParent, ['trailing'])).toBe('panel2');
    });

    it('should navigate complex tree correctly', () => {
      expect(getNodeAtPath(complexTree, ['leading'])).toBe('panel1');
      expect(getNodeAtPath(complexTree, ['trailing', 'leading'])).toBe('panel2');
      expect(getNodeAtPath(complexTree, ['trailing', 'trailing', 'leading'])).toBe('panel3');
      expect(getNodeAtPath(complexTree, ['trailing', 'trailing', 'trailing'])).toBe('panel4');
    });

    it('should return null for invalid paths', () => {
      expect(getNodeAtPath(complexTree, ['invalid' as any])).toBe(null);
      expect(getNodeAtPath(complexTree, ['leading', 'invalid' as any])).toBe(null);
      expect(
        getNodeAtPath(complexTree, ['trailing', 'trailing', 'trailing', 'invalid' as any])
      ).toBe(null);
    });

    it('should handle partial valid paths', () => {
      const trailingChild = getNodeAtPath(complexTree, ['trailing']);
      expect(isParent(trailingChild!)).toBe(true);
      expect((trailingChild as LayoutParent<string>).direction).toBe('column');
    });

    it('should handle deep navigation', () => {
      const deepPath: LayoutPath = ['trailing', 'trailing'];
      const deepNode = getNodeAtPath(complexTree, deepPath);
      expect(isParent(deepNode!)).toBe(true);
      expect((deepNode as LayoutParent<string>).direction).toBe('row');
    });
  });

  describe('getOtherBranch', () => {
    it('should return opposite branch for "leading"', () => {
      expect(getOtherBranch('leading')).toBe('trailing');
    });

    it('should return opposite branch for "trailing"', () => {
      expect(getOtherBranch('trailing')).toBe('leading');
    });

    it('should be symmetric', () => {
      expect(getOtherBranch(getOtherBranch('leading'))).toBe('leading');
      expect(getOtherBranch(getOtherBranch('trailing'))).toBe('trailing');
    });
  });

  describe('getOtherDirection', () => {
    it('should return opposite direction for "row"', () => {
      expect(getOtherDirection('row')).toBe('column');
    });

    it('should return opposite direction for "column"', () => {
      expect(getOtherDirection('column')).toBe('row');
    });

    it('should be symmetric', () => {
      expect(getOtherDirection(getOtherDirection('row'))).toBe('row');
      expect(getOtherDirection(getOtherDirection('column'))).toBe('column');
    });
  });

  describe('isValidSplitPercentage', () => {
    it('should accept valid percentages', () => {
      expect(isValidSplitPercentage(0)).toBe(true);
      expect(isValidSplitPercentage(50)).toBe(true);
      expect(isValidSplitPercentage(100)).toBe(true);
      expect(isValidSplitPercentage(25.5)).toBe(true);
      expect(isValidSplitPercentage(99.99)).toBe(true);
    });

    it('should reject invalid percentages', () => {
      expect(isValidSplitPercentage(-1)).toBe(false);
      expect(isValidSplitPercentage(101)).toBe(false);
      expect(isValidSplitPercentage(-0.1)).toBe(false);
      expect(isValidSplitPercentage(100.1)).toBe(false);
    });

    it('should reject non-numeric values', () => {
      expect(isValidSplitPercentage(NaN)).toBe(false);
      expect(isValidSplitPercentage(Infinity)).toBe(false);
      expect(isValidSplitPercentage(-Infinity)).toBe(false);
      expect(isValidSplitPercentage('50' as any)).toBe(false);
      expect(isValidSplitPercentage(null as any)).toBe(false);
      expect(isValidSplitPercentage(undefined as any)).toBe(false);
    });

    it('should handle edge cases', () => {
      expect(isValidSplitPercentage(0.0)).toBe(true);
      expect(isValidSplitPercentage(100.0)).toBe(true);
      expect(isValidSplitPercentage(-0)).toBe(true); // -0 is still 0
    });
  });

  describe('normalizeSplitPercentage', () => {
    it('should return provided percentage when defined', () => {
      expect(normalizeSplitPercentage(75)).toBe(75);
      expect(normalizeSplitPercentage(0)).toBe(0);
      expect(normalizeSplitPercentage(100)).toBe(100);
      expect(normalizeSplitPercentage(25.5)).toBe(25.5);
    });

    it('should return 50 for undefined', () => {
      expect(normalizeSplitPercentage(undefined)).toBe(50);
    });

    it('should handle edge cases', () => {
      expect(normalizeSplitPercentage(0)).toBe(0);
      expect(normalizeSplitPercentage(-0)).toBe(-0);
    });

    it('should not validate the percentage', () => {
      // This function just normalizes, doesn't validate
      expect(normalizeSplitPercentage(-10)).toBe(-10);
      expect(normalizeSplitPercentage(150)).toBe(150);
      expect(normalizeSplitPercentage(NaN)).toBeNaN();
    });
  });
});
