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
  normalizeSplitPercentage
} from '../src/utils/treeUtils';
import { LayoutParent, LayoutNode, LayoutPath } from '../src/types';

describe('Tree Utilities', () => {
  // Sample tree structures for testing
  const sampleLeaf: LayoutNode<string> = 'panel1';
  
  const sampleParent: LayoutParent<string> = {
    direction: 'row',
    first: 'panel1',
    second: 'panel2',
    splitPercentage: 60
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
        splitPercentage: 25
      },
      splitPercentage: 75
    },
    splitPercentage: 40
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
      const invalidObject = { first: 'a', second: 'b' };
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
        expect(node.first).toBe('panel1');
        expect(node.second).toBe('panel2');
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
        first: 'panel1',
        second: {
          direction: 'column',
          first: 'panel2',
          second: 'panel2' // Duplicate panel ID
        }
      };
      const leaves = getLeaves(singleChildTree);
      expect(leaves).toEqual(['panel1', 'panel2', 'panel2']);
    });

    it('should handle deeply nested structures', () => {
      const deepTree: LayoutParent<number> = {
        direction: 'row',
        first: {
          direction: 'column',
          first: {
            direction: 'row',
            first: 1,
            second: 2
          },
          second: 3
        },
        second: 4
      };
      const leaves = getLeaves(deepTree);
      expect(leaves).toEqual([1, 2, 3, 4]);
    });

    it('should preserve order of traversal', () => {
      const orderedTree: LayoutParent<string> = {
        direction: 'column',
        first: {
          direction: 'row',
          first: 'A',
          second: 'B'
        },
        second: {
          direction: 'row',
          first: 'C',
          second: 'D'
        }
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
      expect(getNodeAtPath(null, ['first'])).toBe(null);
    });

    it('should return null for invalid path on leaf', () => {
      expect(getNodeAtPath(sampleLeaf, ['first'])).toBe(null);
      expect(getNodeAtPath('panel1', ['second'])).toBe(null);
    });

    it('should navigate simple parent correctly', () => {
      expect(getNodeAtPath(sampleParent, ['first'])).toBe('panel1');
      expect(getNodeAtPath(sampleParent, ['second'])).toBe('panel2');
    });

    it('should navigate complex tree correctly', () => {
      expect(getNodeAtPath(complexTree, ['first'])).toBe('panel1');
      expect(getNodeAtPath(complexTree, ['second', 'first'])).toBe('panel2');
      expect(getNodeAtPath(complexTree, ['second', 'second', 'first'])).toBe('panel3');
      expect(getNodeAtPath(complexTree, ['second', 'second', 'second'])).toBe('panel4');
    });

    it('should return null for invalid paths', () => {
      expect(getNodeAtPath(complexTree, ['invalid' as any])).toBe(null);
      expect(getNodeAtPath(complexTree, ['first', 'invalid' as any])).toBe(null);
      expect(getNodeAtPath(complexTree, ['second', 'second', 'second', 'invalid' as any])).toBe(null);
    });

    it('should handle partial valid paths', () => {
      const secondChild = getNodeAtPath(complexTree, ['second']);
      expect(isParent(secondChild!)).toBe(true);
      expect((secondChild as LayoutParent<string>).direction).toBe('column');
    });

    it('should handle deep navigation', () => {
      const deepPath: LayoutPath = ['second', 'second'];
      const deepNode = getNodeAtPath(complexTree, deepPath);
      expect(isParent(deepNode!)).toBe(true);
      expect((deepNode as LayoutParent<string>).direction).toBe('row');
    });
  });

  describe('getOtherBranch', () => {
    it('should return opposite branch for "first"', () => {
      expect(getOtherBranch('first')).toBe('second');
    });

    it('should return opposite branch for "second"', () => {
      expect(getOtherBranch('second')).toBe('first');
    });

    it('should be symmetric', () => {
      expect(getOtherBranch(getOtherBranch('first'))).toBe('first');
      expect(getOtherBranch(getOtherBranch('second'))).toBe('second');
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
