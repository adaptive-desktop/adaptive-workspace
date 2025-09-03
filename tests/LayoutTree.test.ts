/**
 * @fileoverview Tests for the LayoutTree class
 * 
 * These tests verify the core functionality of the LayoutTree class,
 * including construction, basic operations, and immutability.
 */

import { LayoutTree } from '../src/LayoutTree';
import { LayoutParent, LayoutNode } from '../src/types';

describe('LayoutTree', () => {
  describe('Construction', () => {
    it('should create empty layout tree', () => {
      const tree = new LayoutTree<string>();
      expect(tree.isEmpty()).toBe(true);
      expect(tree.getRoot()).toBe(null);
    });

    it('should create tree with null root explicitly', () => {
      const tree = new LayoutTree<string>(null);
      expect(tree.isEmpty()).toBe(true);
      expect(tree.getRoot()).toBe(null);
    });

    it('should create tree with single panel', () => {
      const tree = new LayoutTree<string>('panel1');
      expect(tree.isEmpty()).toBe(false);
      expect(tree.getRoot()).toBe('panel1');
    });

    it('should create tree with number panel ID', () => {
      const tree = new LayoutTree<number>(42);
      expect(tree.isEmpty()).toBe(false);
      expect(tree.getRoot()).toBe(42);
    });

    it('should create tree with parent node', () => {
      const parent: LayoutParent<string> = {
        direction: 'row',
        first: 'panel1',
        second: 'panel2',
        splitPercentage: 60
      };
      const tree = new LayoutTree(parent);
      expect(tree.isEmpty()).toBe(false);
      expect(tree.getRoot()).toEqual(parent);
    });

    it('should create tree with complex nested structure', () => {
      const complexRoot: LayoutParent<string> = {
        direction: 'row',
        first: 'panel1',
        second: {
          direction: 'column',
          first: 'panel2',
          second: 'panel3',
          splitPercentage: 30
        },
        splitPercentage: 70
      };
      const tree = new LayoutTree(complexRoot);
      expect(tree.isEmpty()).toBe(false);
      expect(tree.getRoot()).toEqual(complexRoot);
    });
  });

  describe('Basic Operations', () => {
    it('should return correct root node', () => {
      const root = 'test-panel';
      const tree = new LayoutTree(root);
      expect(tree.getRoot()).toBe(root);
    });

    it('should correctly identify empty trees', () => {
      const emptyTree = new LayoutTree<string>();
      const nonEmptyTree = new LayoutTree<string>('panel');
      
      expect(emptyTree.isEmpty()).toBe(true);
      expect(nonEmptyTree.isEmpty()).toBe(false);
    });

    it('should handle zero as valid panel ID', () => {
      const tree = new LayoutTree<number>(0);
      expect(tree.isEmpty()).toBe(false);
      expect(tree.getRoot()).toBe(0);
    });

    it('should handle empty string as valid panel ID', () => {
      const tree = new LayoutTree<string>('');
      expect(tree.isEmpty()).toBe(false);
      expect(tree.getRoot()).toBe('');
    });
  });

  describe('Reference Behavior', () => {
    it('should maintain reference to original root object', () => {
      const originalRoot: LayoutParent<string> = {
        direction: 'row',
        first: 'panel1',
        second: 'panel2',
        splitPercentage: 50
      };
      const tree = new LayoutTree(originalRoot);

      const retrievedRoot = tree.getRoot() as LayoutParent<string>;

      // The tree maintains a reference to the original object
      expect(retrievedRoot).toBe(originalRoot);

      // Modifying the retrieved root also modifies the original (same reference)
      retrievedRoot.splitPercentage = 75;
      expect(originalRoot.splitPercentage).toBe(75);
      expect((tree.getRoot() as LayoutParent<string>).splitPercentage).toBe(75);
    });

    it('should maintain reference equality for same root', () => {
      const root = 'panel1';
      const tree = new LayoutTree(root);

      expect(tree.getRoot()).toBe(root);
      expect(tree.getRoot()).toBe(tree.getRoot()); // Same reference
    });
  });

  describe('Copy Operations', () => {
    it('should create shallow copy with same root', () => {
      const root = 'panel1';
      const tree = new LayoutTree(root);
      const copy = tree.copy();
      
      expect(copy).not.toBe(tree); // Different instances
      expect(copy.getRoot()).toBe(tree.getRoot()); // Same root reference
      expect(copy.isEmpty()).toBe(tree.isEmpty());
    });

    it('should create copy of empty tree', () => {
      const tree = new LayoutTree<string>();
      const copy = tree.copy();
      
      expect(copy).not.toBe(tree);
      expect(copy.isEmpty()).toBe(true);
      expect(copy.getRoot()).toBe(null);
    });

    it('should create copy with complex structure', () => {
      const complexRoot: LayoutParent<string> = {
        direction: 'row',
        first: 'panel1',
        second: {
          direction: 'column',
          first: 'panel2',
          second: 'panel3'
        }
      };
      const tree = new LayoutTree(complexRoot);
      const copy = tree.copy();
      
      expect(copy).not.toBe(tree);
      expect(copy.getRoot()).toBe(tree.getRoot()); // Same root reference
    });
  });

  describe('Equality Comparison', () => {
    it('should consider empty trees equal', () => {
      const tree1 = new LayoutTree<string>();
      const tree2 = new LayoutTree<string>(null);
      
      expect(tree1.equals(tree2)).toBe(true);
      expect(tree2.equals(tree1)).toBe(true);
    });

    it('should consider trees with same leaf equal', () => {
      const tree1 = new LayoutTree<string>('panel1');
      const tree2 = new LayoutTree<string>('panel1');
      
      expect(tree1.equals(tree2)).toBe(true);
      expect(tree2.equals(tree1)).toBe(true);
    });

    it('should consider trees with different leaves unequal', () => {
      const tree1 = new LayoutTree<string>('panel1');
      const tree2 = new LayoutTree<string>('panel2');
      
      expect(tree1.equals(tree2)).toBe(false);
      expect(tree2.equals(tree1)).toBe(false);
    });

    it('should consider empty and non-empty trees unequal', () => {
      const emptyTree = new LayoutTree<string>();
      const nonEmptyTree = new LayoutTree<string>('panel1');
      
      expect(emptyTree.equals(nonEmptyTree)).toBe(false);
      expect(nonEmptyTree.equals(emptyTree)).toBe(false);
    });

    it('should consider trees with same structure equal', () => {
      const root1: LayoutParent<string> = {
        direction: 'row',
        first: 'panel1',
        second: 'panel2',
        splitPercentage: 60
      };
      const root2: LayoutParent<string> = {
        direction: 'row',
        first: 'panel1',
        second: 'panel2',
        splitPercentage: 60
      };
      
      const tree1 = new LayoutTree(root1);
      const tree2 = new LayoutTree(root2);
      
      expect(tree1.equals(tree2)).toBe(true);
      expect(tree2.equals(tree1)).toBe(true);
    });

    it('should consider trees with different directions unequal', () => {
      const root1: LayoutParent<string> = {
        direction: 'row',
        first: 'panel1',
        second: 'panel2'
      };
      const root2: LayoutParent<string> = {
        direction: 'column',
        first: 'panel1',
        second: 'panel2'
      };
      
      const tree1 = new LayoutTree(root1);
      const tree2 = new LayoutTree(root2);
      
      expect(tree1.equals(tree2)).toBe(false);
    });

    it('should consider trees with different split percentages unequal', () => {
      const root1: LayoutParent<string> = {
        direction: 'row',
        first: 'panel1',
        second: 'panel2',
        splitPercentage: 60
      };
      const root2: LayoutParent<string> = {
        direction: 'row',
        first: 'panel1',
        second: 'panel2',
        splitPercentage: 40
      };
      
      const tree1 = new LayoutTree(root1);
      const tree2 = new LayoutTree(root2);
      
      expect(tree1.equals(tree2)).toBe(false);
    });

    it('should handle undefined split percentages as 50', () => {
      const root1: LayoutParent<string> = {
        direction: 'row',
        first: 'panel1',
        second: 'panel2',
        splitPercentage: 50
      };
      const root2: LayoutParent<string> = {
        direction: 'row',
        first: 'panel1',
        second: 'panel2'
        // splitPercentage undefined, should default to 50
      };
      
      const tree1 = new LayoutTree(root1);
      const tree2 = new LayoutTree(root2);
      
      expect(tree1.equals(tree2)).toBe(true);
    });

    it('should handle complex nested structures', () => {
      const complexRoot1: LayoutParent<string> = {
        direction: 'row',
        first: 'panel1',
        second: {
          direction: 'column',
          first: 'panel2',
          second: 'panel3',
          splitPercentage: 30
        },
        splitPercentage: 70
      };
      const complexRoot2: LayoutParent<string> = {
        direction: 'row',
        first: 'panel1',
        second: {
          direction: 'column',
          first: 'panel2',
          second: 'panel3',
          splitPercentage: 30
        },
        splitPercentage: 70
      };
      
      const tree1 = new LayoutTree(complexRoot1);
      const tree2 = new LayoutTree(complexRoot2);
      
      expect(tree1.equals(tree2)).toBe(true);
    });

    it('should detect differences in nested structures', () => {
      const complexRoot1: LayoutParent<string> = {
        direction: 'row',
        first: 'panel1',
        second: {
          direction: 'column',
          first: 'panel2',
          second: 'panel3'
        }
      };
      const complexRoot2: LayoutParent<string> = {
        direction: 'row',
        first: 'panel1',
        second: {
          direction: 'column',
          first: 'panel2',
          second: 'panel4' // Different panel ID
        }
      };
      
      const tree1 = new LayoutTree(complexRoot1);
      const tree2 = new LayoutTree(complexRoot2);
      
      expect(tree1.equals(tree2)).toBe(false);
    });

    it('should handle mixed leaf and parent comparisons', () => {
      const leafTree = new LayoutTree<string>('panel1');
      const parentTree = new LayoutTree<string>({
        direction: 'row',
        first: 'panel1',
        second: 'panel2'
      });
      
      expect(leafTree.equals(parentTree)).toBe(false);
      expect(parentTree.equals(leafTree)).toBe(false);
    });
  });
});
