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
        leading: 'panel1',
        trailing: 'panel2',
        splitPercentage: 60
      };
      const tree = new LayoutTree(parent);
      expect(tree.isEmpty()).toBe(false);
      expect(tree.getRoot()).toEqual(parent);
    });

    it('should create tree with complex nested structure', () => {
      const complexRoot: LayoutParent<string> = {
        direction: 'row',
        leading: 'panel1',
        trailing: {
          direction: 'column',
          leading: 'panel2',
          trailing: 'panel3',
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
        leading: 'panel1',
        trailing: 'panel2',
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
        leading: 'panel1',
        trailing: {
          direction: 'column',
          leading: 'panel2',
          trailing: 'panel3'
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
        leading: 'panel1',
        trailing: 'panel2',
        splitPercentage: 60
      };
      const root2: LayoutParent<string> = {
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2',
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
        leading: 'panel1',
        trailing: 'panel2'
      };
      const root2: LayoutParent<string> = {
        direction: 'column',
        leading: 'panel1',
        trailing: 'panel2'
      };
      
      const tree1 = new LayoutTree(root1);
      const tree2 = new LayoutTree(root2);
      
      expect(tree1.equals(tree2)).toBe(false);
    });

    it('should consider trees with different split percentages unequal', () => {
      const root1: LayoutParent<string> = {
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2',
        splitPercentage: 60
      };
      const root2: LayoutParent<string> = {
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2',
        splitPercentage: 40
      };
      
      const tree1 = new LayoutTree(root1);
      const tree2 = new LayoutTree(root2);
      
      expect(tree1.equals(tree2)).toBe(false);
    });

    it('should handle undefined split percentages as 50', () => {
      const root1: LayoutParent<string> = {
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2',
        splitPercentage: 50
      };
      const root2: LayoutParent<string> = {
        direction: 'row',
        leading: 'panel1',
        trailing: 'panel2'
        // splitPercentage undefined, should default to 50
      };
      
      const tree1 = new LayoutTree(root1);
      const tree2 = new LayoutTree(root2);
      
      expect(tree1.equals(tree2)).toBe(true);
    });

    it('should handle complex nested structures', () => {
      const complexRoot1: LayoutParent<string> = {
        direction: 'row',
        leading: 'panel1',
        trailing: {
          direction: 'column',
          leading: 'panel2',
          trailing: 'panel3',
          splitPercentage: 30
        },
        splitPercentage: 70
      };
      const complexRoot2: LayoutParent<string> = {
        direction: 'row',
        leading: 'panel1',
        trailing: {
          direction: 'column',
          leading: 'panel2',
          trailing: 'panel3',
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
        leading: 'panel1',
        trailing: {
          direction: 'column',
          leading: 'panel2',
          trailing: 'panel3'
        }
      };
      const complexRoot2: LayoutParent<string> = {
        direction: 'row',
        leading: 'panel1',
        trailing: {
          direction: 'column',
          leading: 'panel2',
          trailing: 'panel4' // Different panel ID
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
        leading: 'panel1',
        trailing: 'panel2'
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
        expect(root.leading).toBe('panel1');
        expect(root.trailing).toBe('panel1');
        expect(root.splitPercentage).toBe(50);
      });

      it('should split single panel tree', () => {
        const tree = new LayoutTree<string>('panel1');
        const newTree = tree.splitRegion([], 'panel2', 'row');

        const root = newTree.getRoot() as LayoutParent<string>;
        expect(root.direction).toBe('row');
        expect(root.leading).toBe('panel1');
        expect(root.trailing).toBe('panel2');
        expect(root.splitPercentage).toBe(50);
      });

      it('should split with column direction', () => {
        const tree = new LayoutTree<string>('panel1');
        const newTree = tree.splitRegion([], 'panel2', 'column');

        const root = newTree.getRoot() as LayoutParent<string>;
        expect(root.direction).toBe('column');
        expect(root.leading).toBe('panel1');
        expect(root.trailing).toBe('panel2');
      });

      it('should split nested node', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2'
        });

        const newTree = tree.splitRegion(['leading'], 'panel3', 'column');
        const root = newTree.getRoot() as LayoutParent<string>;

        expect(root.direction).toBe('row');
        expect(root.trailing).toBe('panel2');

        const leadingChild = root.leading as LayoutParent<string>;
        expect(leadingChild.direction).toBe('column');
        expect(leadingChild.leading).toBe('panel1');
        expect(leadingChild.trailing).toBe('panel3');
      });

      it('should split deeply nested node', () => {
        const complexTree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: {
            direction: 'column',
            leading: 'panel2',
            trailing: 'panel3'
          }
        });

        const newTree = complexTree.splitRegion(['trailing', 'leading'], 'panel4', 'row');
        const root = newTree.getRoot() as LayoutParent<string>;
        const trailingChild = root.trailing as LayoutParent<string>;
        const nestedChild = trailingChild.leading as LayoutParent<string>;

        expect(nestedChild.direction).toBe('row');
        expect(nestedChild.leading).toBe('panel2');
        expect(nestedChild.trailing).toBe('panel4');
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
          tree.splitRegion(['leading'], 'panel2', 'row');
        }).toThrow('Cannot split: path leading does not exist');
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

      it('should remove leading child, promote second', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2'
        });

        const newTree = tree.removeRegion(['leading']);
        expect(newTree.getRoot()).toBe('panel2');
      });

      it('should remove trailing child, promote first', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2'
        });

        const newTree = tree.removeRegion(['trailing']);
        expect(newTree.getRoot()).toBe('panel1');
      });

      it('should remove nested node', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: {
            direction: 'column',
            leading: 'panel2',
            trailing: 'panel3'
          }
        });

        const newTree = tree.removeRegion(['trailing', 'leading']);
        const root = newTree.getRoot() as LayoutParent<string>;

        expect(root.direction).toBe('row');
        expect(root.leading).toBe('panel1');
        expect(root.trailing).toBe('panel3'); // panel3 promoted
      });

      it('should remove complex nested structure', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: {
            direction: 'column',
            leading: 'panel1',
            trailing: 'panel2'
          },
          trailing: 'panel3'
        });

        const newTree = tree.removeRegion(['leading', 'trailing']);
        const root = newTree.getRoot() as LayoutParent<string>;

        expect(root.direction).toBe('row');
        expect(root.leading).toBe('panel1'); // panel1 promoted
        expect(root.trailing).toBe('panel3');
      });

      it('should throw error when sibling not found', () => {
        // This is a theoretical edge case that shouldn't happen in normal usage
        // but we test it for completeness
        const tree = new LayoutTree<string>('panel1');

        expect(() => {
          tree.removeRegion(['leading', 'trailing']);
        }).toThrow('Cannot remove: sibling at path leading/leading not found');
      });

      it('should handle complex nested removal scenarios', () => {
        // Test various complex removal scenarios to ensure robustness
        const complexTree = new LayoutTree<string>({
          direction: 'row',
          leading: {
            direction: 'column',
            leading: 'panel1',
            trailing: {
              direction: 'row',
              leading: 'panel2',
              trailing: 'panel3'
            }
          },
          trailing: 'panel4'
        });

        // Remove a deeply nested node
        const newTree = complexTree.removeRegion(['leading', 'trailing', 'leading']);
        const root = newTree.getRoot() as LayoutParent<string>;
        const leadingChild = root.leading as LayoutParent<string>;

        expect(root.direction).toBe('row');
        expect(leadingChild.direction).toBe('column');
        expect(leadingChild.leading).toBe('panel1');
        expect(leadingChild.trailing).toBe('panel3'); // panel3 promoted
        expect(root.trailing).toBe('panel4');
      });

      it('should not modify original tree', () => {
        const originalRoot = {
          direction: 'row' as const,
          leading: 'panel1',
          trailing: 'panel2'
        };
        const tree = new LayoutTree<string>(originalRoot);
        const newTree = tree.removeRegion(['leading']);

        expect(tree.getRoot()).toBe(originalRoot);
        expect(newTree.getRoot()).toBe('panel2');
      });
    });

    describe('resizeRegion', () => {
      it('should resize root parent node', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2',
          splitPercentage: 50
        });

        const newTree = tree.resizeRegion([], 70);
        const root = newTree.getRoot() as LayoutParent<string>;

        expect(root.direction).toBe('row');
        expect(root.leading).toBe('panel1');
        expect(root.trailing).toBe('panel2');
        expect(root.splitPercentage).toBe(70);
      });

      it('should resize nested parent node', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: {
            direction: 'column',
            leading: 'panel2',
            trailing: 'panel3',
            splitPercentage: 50
          }
        });

        const newTree = tree.resizeRegion(['trailing'], 25);
        const root = newTree.getRoot() as LayoutParent<string>;
        const trailingChild = root.trailing as LayoutParent<string>;

        expect(trailingChild.splitPercentage).toBe(25);
        expect(trailingChild.direction).toBe('column');
        expect(trailingChild.leading).toBe('panel2');
        expect(trailingChild.trailing).toBe('panel3');
      });

      it('should resize deeply nested node', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: {
            direction: 'column',
            leading: 'panel1',
            trailing: {
              direction: 'row',
              leading: 'panel2',
              trailing: 'panel3',
              splitPercentage: 60
            }
          },
          trailing: 'panel4'
        });

        const newTree = tree.resizeRegion(['leading', 'trailing'], 80);
        const root = newTree.getRoot() as LayoutParent<string>;
        const leadingChild = root.leading as LayoutParent<string>;
        const nestedChild = leadingChild.trailing as LayoutParent<string>;

        expect(nestedChild.splitPercentage).toBe(80);
      });

      it('should handle edge case percentages', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2'
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
          leading: 'panel1',
          trailing: 'panel2'
        });

        expect(() => {
          tree.resizeRegion([], -10);
        }).toThrow('Invalid split percentage: -10. Must be between 0 and 100.');
      });

      it('should throw error for invalid percentage - over 100', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2'
        });

        expect(() => {
          tree.resizeRegion([], 150);
        }).toThrow('Invalid split percentage: 150. Must be between 0 and 100.');
      });

      it('should throw error for invalid percentage - NaN', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2'
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
          tree.resizeRegion(['leading'], 50);
        }).toThrow('Cannot resize: path leading does not exist');
      });

      it('should throw error for leaf node path', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2'
        });

        expect(() => {
          tree.resizeRegion(['leading'], 50);
        }).toThrow('Cannot resize: path leading does not point to a parent node');
      });

      it('should not modify original tree', () => {
        const originalRoot = {
          direction: 'row' as const,
          leading: 'panel1',
          trailing: 'panel2',
          splitPercentage: 50
        };
        const tree = new LayoutTree<string>(originalRoot);
        const newTree = tree.resizeRegion([], 70);

        expect((tree.getRoot() as LayoutParent<string>).splitPercentage).toBe(50);
        expect((newTree.getRoot() as LayoutParent<string>).splitPercentage).toBe(70);
      });
    });

    describe('lockRegion', () => {
      it('should lock a region', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2',
        });

        const newTree = tree.lockRegion(['leading'], true);
        const root = newTree.getRoot() as LayoutParent<string>;

        expect(root.constraints?.leading?.locked).toBe(true);
      });

      it('should unlock a region', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2',
          constraints: {
            leading: { locked: true },
          },
        });

        const newTree = tree.lockRegion(['leading'], false);
        const root = newTree.getRoot() as LayoutParent<string>;

        expect(root.constraints?.leading?.locked).toBe(false);
      });

      it('should throw error for root region', () => {
        const tree = new LayoutTree<string>('panel1');

        expect(() => {
          tree.lockRegion([], true);
        }).toThrow('Cannot lock root region');
      });

      it('should throw error for invalid parent path', () => {
        const tree = new LayoutTree<string>('panel1');

        expect(() => {
          tree.lockRegion(['leading'], true);
        }).toThrow('Cannot lock: parent at path  is not a parent node');
      });

      it('should not modify original tree', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2',
        });

        const originalRoot = tree.getRoot();
        tree.lockRegion(['leading'], true);

        expect(tree.getRoot()).toBe(originalRoot);
      });
    });

    describe('setMinSize', () => {
      it('should set minimum size constraint', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2',
        });

        const newTree = tree.setMinSize(['leading'], 100);
        const root = newTree.getRoot() as LayoutParent<string>;

        expect(root.constraints?.leading?.minSize).toBe(100);
      });

      it('should update existing constraints', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2',
          constraints: {
            leading: { locked: true },
          },
        });

        const newTree = tree.setMinSize(['leading'], 150);
        const root = newTree.getRoot() as LayoutParent<string>;

        expect(root.constraints?.leading?.minSize).toBe(150);
        expect(root.constraints?.leading?.locked).toBe(true);
      });

      it('should throw error for root region', () => {
        const tree = new LayoutTree<string>('panel1');

        expect(() => {
          tree.setMinSize([], 100);
        }).toThrow('Cannot set min size for root region');
      });

      it('should throw error for invalid parent path', () => {
        const tree = new LayoutTree<string>('panel1');

        expect(() => {
          tree.setMinSize(['leading'], 100);
        }).toThrow('Cannot set min size: parent at path  is not a parent node');
      });

      it('should not modify original tree', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2',
        });

        const originalRoot = tree.getRoot();
        tree.setMinSize(['leading'], 100);

        expect(tree.getRoot()).toBe(originalRoot);
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
          leading: 'panel1',
          trailing: {
            direction: 'column',
            leading: 'panel2',
            trailing: 'panel3',
          },
        });
        expect(tree.getPanelIds()).toEqual(['panel1', 'panel2', 'panel3']);
      });

      it('should handle complex nested structures', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: {
            direction: 'column',
            leading: 'panel1',
            trailing: 'panel2',
          },
          trailing: {
            direction: 'column',
            leading: 'panel3',
            trailing: 'panel4',
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
          leading: 'panel1',
          trailing: {
            direction: 'column',
            leading: 'panel2',
            trailing: 'panel3',
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
          leading: 'panel1',
          trailing: 'panel2',
        });
        expect(tree.findPanelPath('panel1')).toEqual(['leading']);
        expect(tree.findPanelPath('panel2')).toEqual(['trailing']);
      });

      it('should find panels in complex structure', () => {
        const tree = new LayoutTree<string>({
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
        });
        expect(tree.findPanelPath('panel1')).toEqual(['leading']);
        expect(tree.findPanelPath('panel2')).toEqual(['trailing', 'leading']);
        expect(tree.findPanelPath('panel3')).toEqual(['trailing', 'trailing', 'leading']);
        expect(tree.findPanelPath('panel4')).toEqual(['trailing', 'trailing', 'trailing']);
      });
    });

    describe('getNodeAtPathSafe', () => {
      it('should return node at valid path', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2',
        });
        expect(tree.getNodeAtPathSafe(['leading'])).toBe('panel1');
        expect(tree.getNodeAtPathSafe(['trailing'])).toBe('panel2');
        expect(tree.getNodeAtPathSafe([])).toEqual(tree.getRoot());
      });

      it('should throw error for empty tree', () => {
        const tree = new LayoutTree<string>();
        expect(() => {
          tree.getNodeAtPathSafe(['leading']);
        }).toThrow('Cannot navigate path leading: tree is null');
      });

      it('should throw error for invalid path', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2',
        });
        expect(() => {
          tree.getNodeAtPathSafe(['invalid' as any]);
        }).toThrow('Path invalid does not exist in the tree');
      });

      it('should throw error for non-existent path', () => {
        const tree = new LayoutTree<string>('panel1');
        expect(() => {
          tree.getNodeAtPathSafe(['leading']);
        }).toThrow('Path leading does not exist in the tree');
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
          leading: 'panel1',
          trailing: 'panel2',
        });
        const paths = tree.getAllPaths();
        expect(paths).toContainEqual([]);
        expect(paths).toContainEqual(['leading']);
        expect(paths).toContainEqual(['trailing']);
        expect(paths.length).toBe(3);
      });

      it('should respect max depth parameter', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: {
            direction: 'column',
            leading: 'panel2',
            trailing: 'panel3',
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
          leading: 'panel1',
          trailing: 'panel2',
        });
        expect(tree.getDepth()).toBe(1);
      });

      it('should return correct depth for complex tree', () => {
        const tree = new LayoutTree<string>({
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
        });
        expect(tree.getPanelCount()).toBe(4);
      });

      it('should handle deeply nested structures', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: {
            direction: 'column',
            leading: {
              direction: 'row',
              leading: 'panel1',
              trailing: 'panel2',
            },
            trailing: 'panel3',
          },
          trailing: {
            direction: 'column',
            leading: 'panel4',
            trailing: {
              direction: 'row',
              leading: 'panel5',
              trailing: 'panel6',
            },
          },
        });
        expect(tree.getPanelCount()).toBe(6);
      });
    });
  });

  describe('Constraint Methods', () => {
    describe('isRegionLocked', () => {
      it('should return false for root region', () => {
        const tree = new LayoutTree<string>('panel1');
        expect(tree.isRegionLocked([])).toBe(false);
      });

      it('should return false when no constraints', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2',
        });

        expect(tree.isRegionLocked(['leading'])).toBe(false);
      });

      it('should return true when region is locked', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2',
          constraints: {
            leading: { locked: true },
          },
        });

        expect(tree.isRegionLocked(['leading'])).toBe(true);
      });

      it('should return false when region is not locked', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2',
          constraints: {
            leading: { locked: false },
            trailing: { locked: true },
          },
        });

        expect(tree.isRegionLocked(['leading'])).toBe(false);
        expect(tree.isRegionLocked(['trailing'])).toBe(true);
      });

      it('should return false for invalid parent path', () => {
        const tree = new LayoutTree<string>('panel1');
        expect(tree.isRegionLocked(['leading'])).toBe(false);
      });
    });

    describe('isRegionCollapsible', () => {
      it('should return false for root region', () => {
        const tree = new LayoutTree<string>('panel1');
        expect(tree.isRegionCollapsible([])).toBe(false);
      });

      it('should return false when no constraints', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2',
        });

        expect(tree.isRegionCollapsible(['leading'])).toBe(false);
      });

      it('should return true when region is collapsible', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2',
          constraints: {
            leading: { collapsible: true },
          },
        });

        expect(tree.isRegionCollapsible(['leading'])).toBe(true);
      });

      it('should return false when region is not collapsible', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2',
          constraints: {
            leading: { collapsible: false },
            trailing: { collapsible: true },
          },
        });

        expect(tree.isRegionCollapsible(['leading'])).toBe(false);
        expect(tree.isRegionCollapsible(['trailing'])).toBe(true);
      });
    });

    describe('getRegionConstraints', () => {
      it('should return undefined for root region', () => {
        const tree = new LayoutTree<string>('panel1');
        expect(tree.getRegionConstraints([])).toBeUndefined();
      });

      it('should return undefined when no constraints', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2',
        });

        expect(tree.getRegionConstraints(['leading'])).toBeUndefined();
      });

      it('should return constraints when they exist', () => {
        const constraints = {
          minSize: 100,
          maxSize: 500,
          locked: true,
          collapsible: false,
        };

        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2',
          constraints: {
            leading: constraints,
          },
        });

        expect(tree.getRegionConstraints(['leading'])).toEqual(constraints);
      });

      it('should return undefined for invalid parent path', () => {
        const tree = new LayoutTree<string>('panel1');
        expect(tree.getRegionConstraints(['leading'])).toBeUndefined();
      });
    });

    describe('canResize', () => {
      it('should return true when no constraints', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2',
        });

        expect(tree.canResize([], 60)).toBe(true);
      });

      it('should return false when leading region is locked', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2',
          constraints: {
            leading: { locked: true },
          },
        });

        expect(tree.canResize([], 60)).toBe(false);
      });

      it('should return false when trailing region is locked', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2',
          constraints: {
            trailing: { locked: true },
          },
        });

        expect(tree.canResize([], 60)).toBe(false);
      });

      it('should return false for invalid path', () => {
        const tree = new LayoutTree<string>('panel1');
        expect(tree.canResize(['invalid' as any], 60)).toBe(false);
      });

      it('should return false for non-parent node', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2',
        });

        expect(tree.canResize(['leading'], 60)).toBe(false);
      });
    });

    describe('movePanel', () => {
      it('should move panel to replace another panel in simple case', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2',
        });

        const newTree = tree.movePanel(['leading'], [], 'replace');

        // panel1 should replace the root, panel2 should be removed
        expect(newTree.getRoot()).toBe('panel1');
      });

      it('should throw error when moving non-panel', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: {
            direction: 'column',
            leading: 'panel1',
            trailing: 'panel2',
          },
          trailing: 'panel3',
        });

        expect(() => {
          tree.movePanel([], ['trailing'], 'replace');
        }).toThrow('Cannot move: path  does not point to a panel');
      });

      it('should throw error when moving from non-existent path', () => {
        const tree = new LayoutTree<string>('panel1');

        expect(() => {
          tree.movePanel(['leading'], [], 'replace');
        }).toThrow('Cannot move: path leading does not point to a panel');
      });

      it('should throw error for invalid insert position', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2',
        });

        expect(() => {
          tree.movePanel(['leading'], ['trailing'], 'invalid' as any);
        }).toThrow('Invalid insert position: invalid');
      });

      it('should not modify original tree', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2',
        });

        const originalRoot = tree.getRoot();
        tree.movePanel(['leading'], [], 'replace');

        expect(tree.getRoot()).toBe(originalRoot);
      });
    });
  });

  describe('Serialization', () => {
    describe('serialize', () => {
      it('should serialize empty tree', () => {
        const tree = new LayoutTree<string>();
        const serialized = tree.serialize();
        expect(serialized.version).toBe('0.2.0');
        expect(serialized.tree).toBe(null);
      });

      it('should serialize single panel tree', () => {
        const tree = new LayoutTree<string>('panel1');
        const serialized = tree.serialize();
        expect(serialized.version).toBe('0.2.0');
        expect(serialized.tree).toBe('panel1');
      });

      it('should serialize complex tree', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: {
            direction: 'column',
            leading: 'panel2',
            trailing: 'panel3',
            splitPercentage: 75,
          },
          splitPercentage: 60,
        });
        const serialized = tree.serialize();
        expect(serialized.version).toBe('0.2.0');
        expect(serialized.tree).toEqual({
          direction: 'row',
          leading: 'panel1',
          trailing: {
            direction: 'column',
            leading: 'panel2',
            trailing: 'panel3',
            splitPercentage: 75,
          },
          splitPercentage: 60,
        });
      });
    });

    describe('deserialize', () => {
      it('should deserialize empty tree', () => {
        const serialized = { version: '0.2.0', tree: null };
        const tree = LayoutTree.deserialize<string>(serialized);
        expect(tree.isEmpty()).toBe(true);
        expect(tree.getRoot()).toBe(null);
      });

      it('should deserialize single panel tree', () => {
        const serialized = { version: '0.2.0', tree: 'panel1' };
        const tree = LayoutTree.deserialize<string>(serialized);
        expect(tree.getRoot()).toBe('panel1');
      });

      it('should deserialize complex tree', () => {
        const serialized = {
          version: '0.2.0',
          tree: {
            direction: 'row' as const,
            leading: 'panel1',
            trailing: {
              direction: 'column' as const,
              leading: 'panel2',
              trailing: 'panel3',
              splitPercentage: 75,
            },
            splitPercentage: 60,
          },
        };
        const tree = LayoutTree.deserialize<string>(serialized);
        const root = tree.getRoot() as LayoutParent<string>;
        expect(root.direction).toBe('row');
        expect(root.leading).toBe('panel1');
        expect(root.splitPercentage).toBe(60);

        const trailingChild = root.trailing as LayoutParent<string>;
        expect(trailingChild.direction).toBe('column');
        expect(trailingChild.leading).toBe('panel2');
        expect(trailingChild.trailing).toBe('panel3');
        expect(trailingChild.splitPercentage).toBe(75);
      });

      it('should throw error for invalid serialized data', () => {
        expect(() => {
          LayoutTree.deserialize({ version: '2.0.0', tree: null });
        }).toThrow('Unsupported serialization version');
      });
    });

    describe('clone', () => {
      it('should clone empty tree', () => {
        const original = new LayoutTree<string>();
        const clone = original.clone();
        expect(clone).not.toBe(original);
        expect(clone.isEmpty()).toBe(true);
        expect(clone.equals(original)).toBe(true);
      });

      it('should clone single panel tree', () => {
        const original = new LayoutTree<string>('panel1');
        const clone = original.clone();
        expect(clone).not.toBe(original);
        expect(clone.getRoot()).toBe('panel1');
        expect(clone.equals(original)).toBe(true);
      });

      it('should create deep clone of complex tree', () => {
        const original = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: {
            direction: 'column',
            leading: 'panel2',
            trailing: 'panel3',
          },
        });
        const clone = original.clone();

        expect(clone).not.toBe(original);
        expect(clone.equals(original)).toBe(true);

        // Verify deep cloning by modifying clone
        const clonedTree = clone.resizeRegion([], 80);
        expect(clonedTree.equals(original)).toBe(false);
        expect((original.getRoot() as LayoutParent<string>).splitPercentage).toBeUndefined();
      });
    });

    describe('toJSON', () => {
      it('should convert tree to JSON string', () => {
        const tree = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2',
          splitPercentage: 60,
        });
        const json = tree.toJSON();
        const parsed = JSON.parse(json);
        expect(parsed.version).toBe('0.2.0');
        expect(parsed.tree.direction).toBe('row');
        expect(parsed.tree.leading).toBe('panel1');
        expect(parsed.tree.trailing).toBe('panel2');
        expect(parsed.tree.splitPercentage).toBe(60);
      });

      it('should support pretty printing', () => {
        const tree = new LayoutTree<string>('panel1');
        const json = tree.toJSON(2);
        expect(json).toContain('\n'); // Should have newlines for pretty printing
        expect(json).toContain('  '); // Should have indentation
      });

      it('should handle empty tree', () => {
        const tree = new LayoutTree<string>();
        const json = tree.toJSON();
        const parsed = JSON.parse(json);
        expect(parsed.tree).toBe(null);
      });
    });

    describe('fromJSON', () => {
      it('should create tree from JSON string', () => {
        const json = '{"version":"0.2.0","tree":{"direction":"row","leading":"panel1","trailing":"panel2","splitPercentage":60}}';
        const tree = LayoutTree.fromJSON<string>(json);
        const root = tree.getRoot() as LayoutParent<string>;
        expect(root.direction).toBe('row');
        expect(root.leading).toBe('panel1');
        expect(root.trailing).toBe('panel2');
        expect(root.splitPercentage).toBe(60);
      });

      it('should handle empty tree JSON', () => {
        const json = '{"version":"0.2.0","tree":null}';
        const tree = LayoutTree.fromJSON<string>(json);
        expect(tree.isEmpty()).toBe(true);
      });

      it('should throw error for invalid JSON', () => {
        expect(() => {
          LayoutTree.fromJSON('invalid json');
        }).toThrow('Invalid JSON');
      });

      it('should throw error for invalid tree structure', () => {
        const json = '{"version":"2.0.0","tree":null}';
        expect(() => {
          LayoutTree.fromJSON(json);
        }).toThrow('Unsupported serialization version');
      });
    });

    describe('Round-trip serialization', () => {
      it('should preserve tree through serialize/deserialize', () => {
        const original = new LayoutTree<string>({
          direction: 'row',
          leading: 'panel1',
          trailing: {
            direction: 'column',
            leading: 'panel2',
            trailing: 'panel3',
            splitPercentage: 75,
          },
          splitPercentage: 60,
        });

        const serialized = original.serialize();
        const deserialized = LayoutTree.deserialize<string>(serialized);
        expect(deserialized.equals(original)).toBe(true);
      });

      it('should preserve tree through toJSON/fromJSON', () => {
        const original = new LayoutTree<string>({
          direction: 'column',
          leading: {
            direction: 'row',
            leading: 'panel1',
            trailing: 'panel2',
          },
          trailing: 'panel3',
          splitPercentage: 40,
        });

        const json = original.toJSON();
        const restored = LayoutTree.fromJSON<string>(json);
        expect(restored.equals(original)).toBe(true);
      });
    });
  });
});
