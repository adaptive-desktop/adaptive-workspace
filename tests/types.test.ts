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
  LayoutNode,
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
    it('should accept "leading" value', () => {
      const branch: LayoutBranch = 'leading';
      expect(branch).toBe('leading');
    });

    it('should accept "trailing" value', () => {
      const branch: LayoutBranch = 'trailing';
      expect(branch).toBe('trailing');
    });

    it('should be used in arrays for paths', () => {
      const path: LayoutBranch[] = ['leading', 'trailing', 'leading'];
      expect(path).toEqual(['leading', 'trailing', 'leading']);
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
      const path: LayoutPath = ['leading'];
      expect(path).toEqual(['leading']);
      expect(path.length).toBe(1);
    });

    it('should accept multiple branches', () => {
      const path: LayoutPath = ['leading', 'trailing', 'leading', 'trailing'];
      expect(path).toEqual(['leading', 'trailing', 'leading', 'trailing']);
      expect(path.length).toBe(4);
    });

    it('should support array methods', () => {
      const path: LayoutPath = ['leading', 'trailing'];
      const extended = [...path, 'leading'];
      expect(extended).toEqual(['leading', 'trailing', 'leading']);

      const sliced = path.slice(0, 1);
      expect(sliced).toEqual(['leading']);
    });
  });

  describe('LayoutParent', () => {
    it('should create valid parent with string panel IDs', () => {
      const parent: LayoutParent<string> = {
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2',
        splitPercentage: 60,
      };

      expect(parent.direction).toBe('row');
      expect(parent.leading).toBe('panel1');
      expect(parent.trailing).toBe('panel2');
      expect(parent.splitPercentage).toBe(60);
    });

    it('should create valid parent with number panel IDs', () => {
      const parent: LayoutParent<number> = {
        direction: 'column',
        leading: 1,
        trailing: 2,
        splitPercentage: 30,
      };

      expect(parent.direction).toBe('column');
      expect(parent.leading).toBe(1);
      expect(parent.trailing).toBe(2);
      expect(parent.splitPercentage).toBe(30);
    });

    it('should allow optional splitPercentage', () => {
      const parent: LayoutParent<string> = {
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2',
        // splitPercentage is optional
      };

      expect(parent.direction).toBe('row');
      expect(parent.leading).toBe('panel1');
      expect(parent.trailing).toBe('panel2');
      expect(parent.splitPercentage).toBeUndefined();
    });

    it('should support nested parent structures', () => {
      const nestedParent: LayoutParent<string> = {
        direction: 'row',
        leading: 'panel1',
        trailing: {
          direction: 'column',
          leading: 'panel2',
          trailing: 'panel3',
          splitPercentage: 40,
        },
        splitPercentage: 70,
      };

      expect(nestedParent.direction).toBe('row');
      expect(nestedParent.leading).toBe('panel1');
      expect(typeof nestedParent.trailing).toBe('object');

      const trailingChild = nestedParent.trailing as LayoutParent<string>;
      expect(trailingChild.direction).toBe('column');
      expect(trailingChild.leading).toBe('panel2');
      expect(trailingChild.trailing).toBe('panel3');
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
        leading: 'panel1',
        trailing: 'panel2',
      };

      expect(typeof parentNode).toBe('object');
      expect(parentNode).toHaveProperty('direction');
      expect(parentNode).toHaveProperty('leading');
      expect(parentNode).toHaveProperty('trailing');
    });

    it('should support complex nested structures', () => {
      const complexNode: LayoutNode<string> = {
        direction: 'row',
        leading: {
          direction: 'column',
          leading: 'panel1',
          trailing: 'panel2',
        },
        trailing: {
          direction: 'column',
          leading: 'panel3',
          trailing: {
            direction: 'row',
            leading: 'panel4',
            trailing: 'panel5',
          },
        },
      };

      expect(typeof complexNode).toBe('object');
      expect(complexNode).toHaveProperty('direction', 'row');

      // Verify nested structure exists
      const leadingChild = (complexNode as LayoutParent<string>).leading;
      const trailingChild = (complexNode as LayoutParent<string>).trailing;

      expect(typeof leadingChild).toBe('object');
      expect(typeof trailingChild).toBe('object');
    });

    it('should maintain type safety with mixed ID types', () => {
      // This should work with consistent types
      const stringNode: LayoutNode<string> = {
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2',
      };

      const numberNode: LayoutNode<number> = {
        direction: 'column',
        leading: 1,
        trailing: 2,
      };

      expect(typeof stringNode).toBe('object');
      expect(typeof numberNode).toBe('object');
    });
  });
});
