/**
 * @fileoverview Tests for core type definitions
 * 
 * These tests verify that the type system works correctly and provides
 * proper type safety and inference.
 */

import { 
  PanelId, 
  LayoutDirection, 
  LayoutBranch, 
  LayoutPath, 
  LayoutParent, 
  LayoutNode 
} from '../src/types';

describe('Core Types', () => {
  describe('PanelId', () => {
    it('should accept string values', () => {
      const stringId: PanelId = 'panel1';
      expect(typeof stringId).toBe('string');
      expect(stringId).toBe('panel1');
    });

    it('should accept number values', () => {
      const numberId: PanelId = 42;
      expect(typeof numberId).toBe('number');
      expect(numberId).toBe(42);
    });

    it('should accept zero as a valid number ID', () => {
      const zeroId: PanelId = 0;
      expect(typeof zeroId).toBe('number');
      expect(zeroId).toBe(0);
    });

    it('should accept empty string as a valid string ID', () => {
      const emptyId: PanelId = '';
      expect(typeof emptyId).toBe('string');
      expect(emptyId).toBe('');
    });
  });

  describe('LayoutDirection', () => {
    it('should accept "row" value', () => {
      const direction: LayoutDirection = 'row';
      expect(direction).toBe('row');
    });

    it('should accept "column" value', () => {
      const direction: LayoutDirection = 'column';
      expect(direction).toBe('column');
    });

    it('should be used in type guards', () => {
      const testDirection = (dir: string): dir is LayoutDirection => {
        return dir === 'row' || dir === 'column';
      };

      expect(testDirection('row')).toBe(true);
      expect(testDirection('column')).toBe(true);
      expect(testDirection('invalid')).toBe(false);
    });
  });

  describe('LayoutBranch', () => {
    it('should accept "first" value', () => {
      const branch: LayoutBranch = 'first';
      expect(branch).toBe('first');
    });

    it('should accept "second" value', () => {
      const branch: LayoutBranch = 'second';
      expect(branch).toBe('second');
    });

    it('should be used in arrays for paths', () => {
      const path: LayoutBranch[] = ['first', 'second', 'first'];
      expect(path).toEqual(['first', 'second', 'first']);
      expect(path.length).toBe(3);
    });
  });

  describe('LayoutPath', () => {
    it('should accept empty array', () => {
      const path: LayoutPath = [];
      expect(path).toEqual([]);
      expect(path.length).toBe(0);
    });

    it('should accept single branch', () => {
      const path: LayoutPath = ['first'];
      expect(path).toEqual(['first']);
      expect(path.length).toBe(1);
    });

    it('should accept multiple branches', () => {
      const path: LayoutPath = ['first', 'second', 'first', 'second'];
      expect(path).toEqual(['first', 'second', 'first', 'second']);
      expect(path.length).toBe(4);
    });

    it('should support array methods', () => {
      const path: LayoutPath = ['first', 'second'];
      const extended = [...path, 'first'];
      expect(extended).toEqual(['first', 'second', 'first']);
      
      const sliced = path.slice(0, 1);
      expect(sliced).toEqual(['first']);
    });
  });

  describe('LayoutParent', () => {
    it('should create valid parent with string panel IDs', () => {
      const parent: LayoutParent<string> = {
        direction: 'row',
        first: 'panel1',
        second: 'panel2',
        splitPercentage: 60
      };

      expect(parent.direction).toBe('row');
      expect(parent.first).toBe('panel1');
      expect(parent.second).toBe('panel2');
      expect(parent.splitPercentage).toBe(60);
    });

    it('should create valid parent with number panel IDs', () => {
      const parent: LayoutParent<number> = {
        direction: 'column',
        first: 1,
        second: 2,
        splitPercentage: 30
      };

      expect(parent.direction).toBe('column');
      expect(parent.first).toBe(1);
      expect(parent.second).toBe(2);
      expect(parent.splitPercentage).toBe(30);
    });

    it('should allow optional splitPercentage', () => {
      const parent: LayoutParent<string> = {
        direction: 'row',
        first: 'panel1',
        second: 'panel2'
        // splitPercentage is optional
      };

      expect(parent.direction).toBe('row');
      expect(parent.first).toBe('panel1');
      expect(parent.second).toBe('panel2');
      expect(parent.splitPercentage).toBeUndefined();
    });

    it('should support nested parent structures', () => {
      const nestedParent: LayoutParent<string> = {
        direction: 'row',
        first: 'panel1',
        second: {
          direction: 'column',
          first: 'panel2',
          second: 'panel3',
          splitPercentage: 40
        },
        splitPercentage: 70
      };

      expect(nestedParent.direction).toBe('row');
      expect(nestedParent.first).toBe('panel1');
      expect(typeof nestedParent.second).toBe('object');
      
      const secondChild = nestedParent.second as LayoutParent<string>;
      expect(secondChild.direction).toBe('column');
      expect(secondChild.first).toBe('panel2');
      expect(secondChild.second).toBe('panel3');
    });
  });

  describe('LayoutNode', () => {
    it('should accept panel ID as leaf node', () => {
      const leafNode: LayoutNode<string> = 'panel1';
      expect(leafNode).toBe('panel1');
      expect(typeof leafNode).toBe('string');
    });

    it('should accept parent as internal node', () => {
      const parentNode: LayoutNode<string> = {
        direction: 'row',
        first: 'panel1',
        second: 'panel2'
      };

      expect(typeof parentNode).toBe('object');
      expect(parentNode).toHaveProperty('direction');
      expect(parentNode).toHaveProperty('first');
      expect(parentNode).toHaveProperty('second');
    });

    it('should support complex nested structures', () => {
      const complexNode: LayoutNode<string> = {
        direction: 'row',
        first: {
          direction: 'column',
          first: 'panel1',
          second: 'panel2'
        },
        second: {
          direction: 'column',
          first: 'panel3',
          second: {
            direction: 'row',
            first: 'panel4',
            second: 'panel5'
          }
        }
      };

      expect(typeof complexNode).toBe('object');
      expect(complexNode).toHaveProperty('direction', 'row');
      
      // Verify nested structure exists
      const firstChild = (complexNode as LayoutParent<string>).first;
      const secondChild = (complexNode as LayoutParent<string>).second;
      
      expect(typeof firstChild).toBe('object');
      expect(typeof secondChild).toBe('object');
    });

    it('should maintain type safety with mixed ID types', () => {
      // This should work with consistent types
      const stringNode: LayoutNode<string> = {
        direction: 'row',
        first: 'panel1',
        second: 'panel2'
      };

      const numberNode: LayoutNode<number> = {
        direction: 'column',
        first: 1,
        second: 2
      };

      expect(typeof stringNode).toBe('object');
      expect(typeof numberNode).toBe('object');
    });
  });
});
