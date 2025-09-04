/**
 * @fileoverview Tests for the LayoutTree class
 * 
 * These tests verify the core functionality of the LayoutTree class,
 * including construction, basic operations, and immutability.
 */

import { LayoutTree } from '../src/LayoutTree';
import { LayoutParent, LayoutNode, LayoutPath } from '../src/types';

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

  describe('Tree Operations', () => {
    describe('splitRegion', () => {
      it('should split empty tree', () => {
        const tree = new LayoutTree<string>();
        const newTree = tree.splitRegion([], 'panel1', 'row');

        const root = newTree.getRoot() as LayoutParent<string>;
        expect(root.direction).toBe('row');
        expect(root.first).toBe('panel1');
        expect(root.second).toBe('panel1');
        expect(root.splitPercentage).toBe(50);
      });

      it('should split single panel tree', () => {
        const tree = new LayoutTree<string>('panel1');
        const newTree = tree.splitRegion([], 'panel2', 'row');

        const root = newTree.getRoot() as LayoutParent<string>;
        expect(root.direction).toBe('row');
        expect(root.first).toBe('panel1');
        expect(root.second).toBe('panel2');
        expect(root.splitPercentage).toBe(50);
      });

      it('should split with column direction', () => {
        const tree = new LayoutTree<string>('panel1');
        const newTree = tree.splitRegion([], 'panel2', 'column');

        const root = newTree.getRoot() as LayoutParent<string>;
        expect(root.direction).toBe('column');
        expect(root.first).toBe('panel1');
        expect(root.second).toBe('panel2');
      });

      it('should split nested node', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          first: 'panel1',
          second: 'panel2'
        });

        const newTree = tree.splitRegion(['first'], 'panel3', 'column');
        const root = newTree.getRoot() as LayoutParent<string>;

        expect(root.direction).toBe('row');
        expect(root.second).toBe('panel2');

        const firstChild = root.first as LayoutParent<string>;
        expect(firstChild.direction).toBe('column');
        expect(firstChild.first).toBe('panel1');
        expect(firstChild.second).toBe('panel3');
      });

      it('should split deeply nested node', () => {
        const complexTree = new LayoutTree<string>({
          direction: 'row',
          first: 'panel1',
          second: {
            direction: 'column',
            first: 'panel2',
            second: 'panel3'
          }
        });

        const newTree = complexTree.splitRegion(['second', 'first'], 'panel4', 'row');
        const root = newTree.getRoot() as LayoutParent<string>;
        const secondChild = root.second as LayoutParent<string>;
        const nestedChild = secondChild.first as LayoutParent<string>;

        expect(nestedChild.direction).toBe('row');
        expect(nestedChild.first).toBe('panel2');
        expect(nestedChild.second).toBe('panel4');
      });

      it('should throw error for invalid path', () => {
        const tree = new LayoutTree<string>('panel1');

        expect(() => {
          tree.splitRegion(['invalid' as any], 'panel2', 'row');
        }).toThrow('Cannot split: path invalid does not exist');
      });

      it('should throw error for non-existent path', () => {
        const tree = new LayoutTree<string>('panel1');

        expect(() => {
          tree.splitRegion(['first'], 'panel2', 'row');
        }).toThrow('Cannot split: path first does not exist');
      });

      it('should default to row direction', () => {
        const tree = new LayoutTree<string>('panel1');
        const newTree = tree.splitRegion([], 'panel2');

        const root = newTree.getRoot() as LayoutParent<string>;
        expect(root.direction).toBe('row');
      });

      it('should not modify original tree', () => {
        const tree = new LayoutTree<string>('panel1');
        const newTree = tree.splitRegion([], 'panel2', 'row');

        expect(tree.getRoot()).toBe('panel1');
        expect(newTree.getRoot()).not.toBe(tree.getRoot());
      });
    });

    describe('removeRegion', () => {
      it('should remove from empty tree', () => {
        const tree = new LayoutTree<string>();
        const newTree = tree.removeRegion([]);

        expect(newTree.isEmpty()).toBe(true);
        expect(newTree.getRoot()).toBe(null);
      });

      it('should remove root node', () => {
        const tree = new LayoutTree<string>('panel1');
        const newTree = tree.removeRegion([]);

        expect(newTree.isEmpty()).toBe(true);
        expect(newTree.getRoot()).toBe(null);
      });

      it('should remove first child, promote second', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          first: 'panel1',
          second: 'panel2'
        });

        const newTree = tree.removeRegion(['first']);
        expect(newTree.getRoot()).toBe('panel2');
      });

      it('should remove second child, promote first', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          first: 'panel1',
          second: 'panel2'
        });

        const newTree = tree.removeRegion(['second']);
        expect(newTree.getRoot()).toBe('panel1');
      });

      it('should remove nested node', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          first: 'panel1',
          second: {
            direction: 'column',
            first: 'panel2',
            second: 'panel3'
          }
        });

        const newTree = tree.removeRegion(['second', 'first']);
        const root = newTree.getRoot() as LayoutParent<string>;

        expect(root.direction).toBe('row');
        expect(root.first).toBe('panel1');
        expect(root.second).toBe('panel3'); // panel3 promoted
      });

      it('should remove complex nested structure', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          first: {
            direction: 'column',
            first: 'panel1',
            second: 'panel2'
          },
          second: 'panel3'
        });

        const newTree = tree.removeRegion(['first', 'second']);
        const root = newTree.getRoot() as LayoutParent<string>;

        expect(root.direction).toBe('row');
        expect(root.first).toBe('panel1'); // panel1 promoted
        expect(root.second).toBe('panel3');
      });

      it('should throw error when sibling not found', () => {
        // This is a theoretical edge case that shouldn't happen in normal usage
        // but we test it for completeness
        const tree = new LayoutTree<string>('panel1');

        expect(() => {
          tree.removeRegion(['first', 'second']);
        }).toThrow('Cannot remove: sibling at path first/first not found');
      });

      it('should handle complex nested removal scenarios', () => {
        // Test various complex removal scenarios to ensure robustness
        const complexTree = new LayoutTree<string>({
          direction: 'row',
          first: {
            direction: 'column',
            first: 'panel1',
            second: {
              direction: 'row',
              first: 'panel2',
              second: 'panel3'
            }
          },
          second: 'panel4'
        });

        // Remove a deeply nested node
        const newTree = complexTree.removeRegion(['first', 'second', 'first']);
        const root = newTree.getRoot() as LayoutParent<string>;
        const firstChild = root.first as LayoutParent<string>;

        expect(root.direction).toBe('row');
        expect(firstChild.direction).toBe('column');
        expect(firstChild.first).toBe('panel1');
        expect(firstChild.second).toBe('panel3'); // panel3 promoted
        expect(root.second).toBe('panel4');
      });

      it('should not modify original tree', () => {
        const originalRoot = {
          direction: 'row' as const,
          first: 'panel1',
          second: 'panel2'
        };
        const tree = new LayoutTree<string>(originalRoot);
        const newTree = tree.removeRegion(['first']);

        expect(tree.getRoot()).toBe(originalRoot);
        expect(newTree.getRoot()).toBe('panel2');
      });
    });

    describe('resizeRegion', () => {
      it('should resize root parent node', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          first: 'panel1',
          second: 'panel2',
          splitPercentage: 50
        });

        const newTree = tree.resizeRegion([], 70);
        const root = newTree.getRoot() as LayoutParent<string>;

        expect(root.direction).toBe('row');
        expect(root.first).toBe('panel1');
        expect(root.second).toBe('panel2');
        expect(root.splitPercentage).toBe(70);
      });

      it('should resize nested parent node', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          first: 'panel1',
          second: {
            direction: 'column',
            first: 'panel2',
            second: 'panel3',
            splitPercentage: 50
          }
        });

        const newTree = tree.resizeRegion(['second'], 25);
        const root = newTree.getRoot() as LayoutParent<string>;
        const secondChild = root.second as LayoutParent<string>;

        expect(secondChild.splitPercentage).toBe(25);
        expect(secondChild.direction).toBe('column');
        expect(secondChild.first).toBe('panel2');
        expect(secondChild.second).toBe('panel3');
      });

      it('should resize deeply nested node', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          first: {
            direction: 'column',
            first: 'panel1',
            second: {
              direction: 'row',
              first: 'panel2',
              second: 'panel3',
              splitPercentage: 60
            }
          },
          second: 'panel4'
        });

        const newTree = tree.resizeRegion(['first', 'second'], 80);
        const root = newTree.getRoot() as LayoutParent<string>;
        const firstChild = root.first as LayoutParent<string>;
        const nestedChild = firstChild.second as LayoutParent<string>;

        expect(nestedChild.splitPercentage).toBe(80);
      });

      it('should handle edge case percentages', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          first: 'panel1',
          second: 'panel2'
        });

        // Test 0%
        const tree0 = tree.resizeRegion([], 0);
        expect((tree0.getRoot() as LayoutParent<string>).splitPercentage).toBe(0);

        // Test 100%
        const tree100 = tree.resizeRegion([], 100);
        expect((tree100.getRoot() as LayoutParent<string>).splitPercentage).toBe(100);

        // Test decimal
        const treeDecimal = tree.resizeRegion([], 33.33);
        expect((treeDecimal.getRoot() as LayoutParent<string>).splitPercentage).toBe(33.33);
      });

      it('should throw error for invalid percentage - negative', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          first: 'panel1',
          second: 'panel2'
        });

        expect(() => {
          tree.resizeRegion([], -10);
        }).toThrow('Invalid split percentage: -10. Must be between 0 and 100.');
      });

      it('should throw error for invalid percentage - over 100', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          first: 'panel1',
          second: 'panel2'
        });

        expect(() => {
          tree.resizeRegion([], 150);
        }).toThrow('Invalid split percentage: 150. Must be between 0 and 100.');
      });

      it('should throw error for invalid percentage - NaN', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          first: 'panel1',
          second: 'panel2'
        });

        expect(() => {
          tree.resizeRegion([], NaN);
        }).toThrow('Invalid split percentage: NaN. Must be between 0 and 100.');
      });

      it('should throw error for empty tree', () => {
        const tree = new LayoutTree<string>();

        expect(() => {
          tree.resizeRegion([], 50);
        }).toThrow('Cannot resize: tree is empty');
      });

      it('should throw error for non-existent path', () => {
        const tree = new LayoutTree<string>('panel1');

        expect(() => {
          tree.resizeRegion(['first'], 50);
        }).toThrow('Cannot resize: path first does not exist');
      });

      it('should throw error for leaf node path', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          first: 'panel1',
          second: 'panel2'
        });

        expect(() => {
          tree.resizeRegion(['first'], 50);
        }).toThrow('Cannot resize: path first does not point to a parent node');
      });

      it('should not modify original tree', () => {
        const originalRoot = {
          direction: 'row' as const,
          first: 'panel1',
          second: 'panel2',
          splitPercentage: 50
        };
        const tree = new LayoutTree<string>(originalRoot);
        const newTree = tree.resizeRegion([], 70);

        expect((tree.getRoot() as LayoutParent<string>).splitPercentage).toBe(50);
        expect((newTree.getRoot() as LayoutParent<string>).splitPercentage).toBe(70);
      });
    });
  });

  describe('Path Navigation', () => {
    describe('getPanelIds', () => {
      it('should return empty array for empty tree', () => {
        const tree = new LayoutTree<string>();
        expect(tree.getPanelIds()).toEqual([]);
      });

      it('should return single panel for single panel tree', () => {
        const tree = new LayoutTree<string>('panel1');
        expect(tree.getPanelIds()).toEqual(['panel1']);
      });

      it('should return all panels in depth-first order', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          first: 'panel1',
          second: {
            direction: 'column',
            first: 'panel2',
            second: 'panel3',
          },
        });
        expect(tree.getPanelIds()).toEqual(['panel1', 'panel2', 'panel3']);
      });

      it('should handle complex nested structures', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          first: {
            direction: 'column',
            first: 'panel1',
            second: 'panel2',
          },
          second: {
            direction: 'column',
            first: 'panel3',
            second: 'panel4',
          },
        });
        expect(tree.getPanelIds()).toEqual(['panel1', 'panel2', 'panel3', 'panel4']);
      });
    });

    describe('hasPanel', () => {
      it('should return false for empty tree', () => {
        const tree = new LayoutTree<string>();
        expect(tree.hasPanel('panel1')).toBe(false);
      });

      it('should return true for existing panel', () => {
        const tree = new LayoutTree<string>('panel1');
        expect(tree.hasPanel('panel1')).toBe(true);
      });

      it('should return false for non-existing panel', () => {
        const tree = new LayoutTree<string>('panel1');
        expect(tree.hasPanel('panel2')).toBe(false);
      });

      it('should find panels in complex structures', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          first: 'panel1',
          second: {
            direction: 'column',
            first: 'panel2',
            second: 'panel3',
          },
        });
        expect(tree.hasPanel('panel1')).toBe(true);
        expect(tree.hasPanel('panel2')).toBe(true);
        expect(tree.hasPanel('panel3')).toBe(true);
        expect(tree.hasPanel('panel4')).toBe(false);
      });
    });

    describe('findPanelPath', () => {
      it('should return null for empty tree', () => {
        const tree = new LayoutTree<string>();
        expect(tree.findPanelPath('panel1')).toBe(null);
      });

      it('should return empty path for root panel', () => {
        const tree = new LayoutTree<string>('panel1');
        expect(tree.findPanelPath('panel1')).toEqual([]);
      });

      it('should return null for non-existing panel', () => {
        const tree = new LayoutTree<string>('panel1');
        expect(tree.findPanelPath('panel2')).toBe(null);
      });

      it('should find panels in simple structure', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          first: 'panel1',
          second: 'panel2',
        });
        expect(tree.findPanelPath('panel1')).toEqual(['first']);
        expect(tree.findPanelPath('panel2')).toEqual(['second']);
      });

      it('should find panels in complex structure', () => {
        const tree = new LayoutTree<string>({
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
        });
        expect(tree.findPanelPath('panel1')).toEqual(['first']);
        expect(tree.findPanelPath('panel2')).toEqual(['second', 'first']);
        expect(tree.findPanelPath('panel3')).toEqual(['second', 'second', 'first']);
        expect(tree.findPanelPath('panel4')).toEqual(['second', 'second', 'second']);
      });
    });

    describe('getNodeAtPathSafe', () => {
      it('should return node at valid path', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          first: 'panel1',
          second: 'panel2',
        });
        expect(tree.getNodeAtPathSafe(['first'])).toBe('panel1');
        expect(tree.getNodeAtPathSafe(['second'])).toBe('panel2');
        expect(tree.getNodeAtPathSafe([])).toEqual(tree.getRoot());
      });

      it('should throw error for empty tree', () => {
        const tree = new LayoutTree<string>();
        expect(() => {
          tree.getNodeAtPathSafe(['first']);
        }).toThrow('Cannot navigate path first: tree is null');
      });

      it('should throw error for invalid path', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          first: 'panel1',
          second: 'panel2',
        });
        expect(() => {
          tree.getNodeAtPathSafe(['invalid' as any]);
        }).toThrow('Path invalid does not exist in the tree');
      });

      it('should throw error for non-existent path', () => {
        const tree = new LayoutTree<string>('panel1');
        expect(() => {
          tree.getNodeAtPathSafe(['first']);
        }).toThrow('Path first does not exist in the tree');
      });
    });

    describe('getAllPaths', () => {
      it('should return empty array for empty tree', () => {
        const tree = new LayoutTree<string>();
        expect(tree.getAllPaths()).toEqual([]);
      });

      it('should return root path for single panel', () => {
        const tree = new LayoutTree<string>('panel1');
        expect(tree.getAllPaths()).toEqual([[]]);
      });

      it('should return all paths for simple tree', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          first: 'panel1',
          second: 'panel2',
        });
        const paths = tree.getAllPaths();
        expect(paths).toContainEqual([]);
        expect(paths).toContainEqual(['first']);
        expect(paths).toContainEqual(['second']);
        expect(paths.length).toBe(3);
      });

      it('should respect max depth parameter', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          first: 'panel1',
          second: {
            direction: 'column',
            first: 'panel2',
            second: 'panel3',
          },
        });
        const paths = tree.getAllPaths(1);
        const longPaths = paths.filter((path) => path.length > 1);
        expect(longPaths.length).toBe(0);
      });
    });

    describe('getDepth', () => {
      it('should return -1 for empty tree', () => {
        const tree = new LayoutTree<string>();
        expect(tree.getDepth()).toBe(-1);
      });

      it('should return 0 for single panel', () => {
        const tree = new LayoutTree<string>('panel1');
        expect(tree.getDepth()).toBe(0);
      });

      it('should return 1 for simple tree', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          first: 'panel1',
          second: 'panel2',
        });
        expect(tree.getDepth()).toBe(1);
      });

      it('should return correct depth for complex tree', () => {
        const tree = new LayoutTree<string>({
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
        });
        expect(tree.getDepth()).toBe(3);
      });
    });

    describe('getPanelCount', () => {
      it('should return 0 for empty tree', () => {
        const tree = new LayoutTree<string>();
        expect(tree.getPanelCount()).toBe(0);
      });

      it('should return 1 for single panel', () => {
        const tree = new LayoutTree<string>('panel1');
        expect(tree.getPanelCount()).toBe(1);
      });

      it('should return correct count for complex tree', () => {
        const tree = new LayoutTree<string>({
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
        });
        expect(tree.getPanelCount()).toBe(4);
      });

      it('should handle deeply nested structures', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          first: {
            direction: 'column',
            first: {
              direction: 'row',
              first: 'panel1',
              second: 'panel2',
            },
            second: 'panel3',
          },
          second: {
            direction: 'column',
            first: 'panel4',
            second: {
              direction: 'row',
              first: 'panel5',
              second: 'panel6',
            },
          },
        });
        expect(tree.getPanelCount()).toBe(6);
      });
    });
  });
});
