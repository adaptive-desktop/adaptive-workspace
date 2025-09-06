/**
 * @fileoverview Tests for serialization utilities
 *
 * These tests verify the serialization and deserialization functions for
 * converting binary layout trees to/from JSON format.
 */

import {
  serializeLayoutTree,
  deserializeLayoutTree,
  isValidSerializedTree,
  cloneLayoutTree,
  SERIALIZATION_VERSION,
  SerializableLayoutTree,
} from '../src/utils/serialization';
import { LayoutParent, LayoutNode } from '../src/shared/types';

describe('Serialization Utilities', () => {
  // Sample tree structures for testing
  const simpleTree: LayoutParent<string> = {
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

  describe('serializeLayoutTree', () => {
    it('should serialize null tree', () => {
      const result = serializeLayoutTree(null);
      expect(result).toEqual({
        version: SERIALIZATION_VERSION,
        tree: null,
      });
    });

    it('should serialize single panel', () => {
      const result = serializeLayoutTree('panel1');
      expect(result).toEqual({
        version: SERIALIZATION_VERSION,
        tree: 'panel1',
      });
    });

    it('should serialize number panel ID', () => {
      const result = serializeLayoutTree(42);
      expect(result).toEqual({
        version: SERIALIZATION_VERSION,
        tree: 42,
      });
    });

    it('should serialize simple tree', () => {
      const result = serializeLayoutTree(simpleTree);
      expect(result).toEqual({
        version: SERIALIZATION_VERSION,
        tree: {
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2',
          splitPercentage: 60,
        },
      });
    });

    it('should serialize complex nested tree', () => {
      const result = serializeLayoutTree(complexTree);
      expect(result).toEqual({
        version: SERIALIZATION_VERSION,
        tree: {
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
        },
      });
    });

    it('should serialize tree without split percentage', () => {
      const treeWithoutSplit: LayoutParent<string> = {
        direction: 'column',
        leading: 'panel1',
        trailing: 'panel2',
      };
      const result = serializeLayoutTree(treeWithoutSplit);
      expect(result.tree).toEqual({
        direction: 'column',
        leading: 'panel1',
        trailing: 'panel2',
        splitPercentage: undefined,
      });
    });

    it('should handle mixed panel ID types', () => {
      const mixedTree: LayoutParent<string | number> = {
        direction: 'row',
        leading: 'stringPanel',
        trailing: 42,
      };
      const result = serializeLayoutTree(mixedTree);
      expect(result.tree).toEqual({
        direction: 'row',
        leading: 'stringPanel',
        trailing: 42,
        splitPercentage: undefined,
      });
    });
  });

  describe('deserializeLayoutTree', () => {
    it('should deserialize null tree', () => {
      const serialized: SerializableLayoutTree = {
        version: SERIALIZATION_VERSION,
        tree: null,
      };
      const result = deserializeLayoutTree(serialized);
      expect(result).toBe(null);
    });

    it('should deserialize single panel', () => {
      const serialized: SerializableLayoutTree = {
        version: SERIALIZATION_VERSION,
        tree: 'panel1',
      };
      const result = deserializeLayoutTree(serialized);
      expect(result).toBe('panel1');
    });

    it('should deserialize number panel ID', () => {
      const serialized: SerializableLayoutTree = {
        version: SERIALIZATION_VERSION,
        tree: 42,
      };
      const result = deserializeLayoutTree(serialized);
      expect(result).toBe(42);
    });

    it('should deserialize simple tree', () => {
      const serialized: SerializableLayoutTree = {
        version: SERIALIZATION_VERSION,
        tree: {
          direction: 'row',
          leading: 'panel1',
          trailing: 'panel2',
          splitPercentage: 60,
        },
      };
      const result = deserializeLayoutTree<string>(serialized);
      expect(result).toEqual(simpleTree);
    });

    it('should deserialize complex nested tree', () => {
      const serialized: SerializableLayoutTree = {
        version: SERIALIZATION_VERSION,
        tree: {
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
        },
      };
      const result = deserializeLayoutTree<string>(serialized);
      expect(result).toEqual(complexTree);
    });

    it('should handle undefined split percentage', () => {
      const serialized: SerializableLayoutTree = {
        version: SERIALIZATION_VERSION,
        tree: {
          direction: 'column',
          leading: 'panel1',
          trailing: 'panel2',
        },
      };
      const result = deserializeLayoutTree<string>(serialized);
      expect(result).toEqual({
        direction: 'column',
        leading: 'panel1',
        trailing: 'panel2',
        splitPercentage: undefined,
      });
    });

    it('should throw error for invalid data type', () => {
      expect(() => {
        deserializeLayoutTree('invalid' as any);
      }).toThrow('Invalid serialized data: must be an object');

      expect(() => {
        deserializeLayoutTree(null as any);
      }).toThrow('Invalid serialized data: must be an object');
    });

    it('should throw error for missing version', () => {
      expect(() => {
        deserializeLayoutTree({} as any);
      }).toThrow('Invalid serialized data: missing version');
    });

    it('should throw error for unsupported version', () => {
      expect(() => {
        deserializeLayoutTree({
          version: '2.0.0',
          tree: null,
        });
      }).toThrow('Unsupported serialization version: 2.0.0');
    });

    it('should throw error for missing tree property', () => {
      expect(() => {
        deserializeLayoutTree({
          version: SERIALIZATION_VERSION,
        } as any);
      }).toThrow('Invalid serialized data: missing tree property');
    });

    it('should throw error for invalid parent node structure', () => {
      expect(() => {
        deserializeLayoutTree({
          version: SERIALIZATION_VERSION,
          tree: {
            direction: 'row',
            leading: 'panel1',
            // missing second
          },
        } as any);
      }).toThrow('Invalid parent node: missing required properties');
    });

    it('should throw error for invalid direction', () => {
      expect(() => {
        deserializeLayoutTree({
          version: SERIALIZATION_VERSION,
          tree: {
            direction: 'invalid',
            leading: 'panel1',
            trailing: 'panel2',
          },
        } as any);
      }).toThrow('Invalid direction: invalid');
    });

    it('should throw error for invalid split percentage', () => {
      expect(() => {
        deserializeLayoutTree({
          version: SERIALIZATION_VERSION,
          tree: {
            direction: 'row',
            leading: 'panel1',
            trailing: 'panel2',
            splitPercentage: -10,
          },
        });
      }).toThrow('Invalid split percentage: -10');

      expect(() => {
        deserializeLayoutTree({
          version: SERIALIZATION_VERSION,
          tree: {
            direction: 'row',
            leading: 'panel1',
            trailing: 'panel2',
            splitPercentage: 150,
          },
        });
      }).toThrow('Invalid split percentage: 150');
    });

    it('should throw error for null children', () => {
      expect(() => {
        deserializeLayoutTree({
          version: SERIALIZATION_VERSION,
          tree: {
            direction: 'row',
            leading: null,
            trailing: 'panel2',
          },
        } as any);
      }).toThrow('Invalid parent node: children cannot be null');
    });
  });

  describe('Round-trip serialization', () => {
    it('should preserve null tree', () => {
      const original = null;
      const serialized = serializeLayoutTree(original);
      const deserialized = deserializeLayoutTree(serialized);
      expect(deserialized).toEqual(original);
    });

    it('should preserve single panel', () => {
      const original = 'panel1';
      const serialized = serializeLayoutTree(original);
      const deserialized = deserializeLayoutTree(serialized);
      expect(deserialized).toEqual(original);
    });

    it('should preserve simple tree', () => {
      const serialized = serializeLayoutTree(simpleTree);
      const deserialized = deserializeLayoutTree<string>(serialized);
      expect(deserialized).toEqual(simpleTree);
    });

    it('should preserve complex tree', () => {
      const serialized = serializeLayoutTree(complexTree);
      const deserialized = deserializeLayoutTree<string>(serialized);
      expect(deserialized).toEqual(complexTree);
    });

    it('should preserve number panel IDs', () => {
      const numberTree: LayoutParent<number> = {
        direction: 'column',
        leading: 1,
        trailing: 2,
        splitPercentage: 30,
      };
      const serialized = serializeLayoutTree(numberTree);
      const deserialized = deserializeLayoutTree<number>(serialized);
      expect(deserialized).toEqual(numberTree);
    });
  });

  describe('isValidSerializedTree', () => {
    it('should accept valid serialized trees', () => {
      const validTrees = [
        { version: SERIALIZATION_VERSION, tree: null },
        { version: SERIALIZATION_VERSION, tree: 'panel1' },
        { version: SERIALIZATION_VERSION, tree: 42 },
        {
          version: SERIALIZATION_VERSION,
          tree: {
            direction: 'row',
            leading: 'panel1',
            trailing: 'panel2',
          },
        },
        {
          version: SERIALIZATION_VERSION,
          tree: {
            direction: 'column',
            leading: 'panel1',
            trailing: {
              direction: 'row',
              leading: 'panel2',
              trailing: 'panel3',
              splitPercentage: 50,
            },
            splitPercentage: 75,
          },
        },
      ];

      validTrees.forEach((tree) => {
        expect(isValidSerializedTree(tree)).toBe(true);
      });
    });

    it('should reject invalid data types', () => {
      const invalidData = [null, undefined, 'string', 42, [], true];

      invalidData.forEach((data) => {
        expect(isValidSerializedTree(data)).toBe(false);
      });
    });

    it('should reject missing properties', () => {
      const invalidTrees = [
        {}, // missing version and tree
        { version: SERIALIZATION_VERSION }, // missing tree
        { tree: null }, // missing version
      ];

      invalidTrees.forEach((tree) => {
        expect(isValidSerializedTree(tree)).toBe(false);
      });
    });

    it('should reject invalid version', () => {
      const invalidVersions = [
        { version: '2.0.0', tree: null },
        { version: 123, tree: null },
        { version: null, tree: null },
      ];

      invalidVersions.forEach((tree) => {
        expect(isValidSerializedTree(tree)).toBe(false);
      });
    });

    it('should reject invalid tree structures', () => {
      const invalidTrees = [
        {
          version: SERIALIZATION_VERSION,
          tree: {
            direction: 'invalid',
            leading: 'panel1',
            trailing: 'panel2',
          },
        },
        {
          version: SERIALIZATION_VERSION,
          tree: {
            direction: 'row',
            leading: 'panel1',
            // missing second
          },
        },
        {
          version: SERIALIZATION_VERSION,
          tree: {
            direction: 'row',
            leading: 'panel1',
            trailing: 'panel2',
            splitPercentage: -10,
          },
        },
        {
          version: SERIALIZATION_VERSION,
          tree: {
            direction: 'row',
            leading: 'panel1',
            trailing: 'panel2',
            splitPercentage: 150,
          },
        },
      ];

      invalidTrees.forEach((tree) => {
        expect(isValidSerializedTree(tree)).toBe(false);
      });
    });

    it('should handle nested invalid structures', () => {
      const invalidTree = {
        version: SERIALIZATION_VERSION,
        tree: {
          direction: 'row',
          leading: 'panel1',
          trailing: {
            direction: 'invalid', // Invalid nested direction
            leading: 'panel2',
            trailing: 'panel3',
          },
        },
      };

      expect(isValidSerializedTree(invalidTree)).toBe(false);
    });
  });

  describe('cloneLayoutTree', () => {
    it('should clone null tree', () => {
      const original = null;
      const clone = cloneLayoutTree(original);
      expect(clone).toBe(null);
      expect(clone).toEqual(original);
    });

    it('should clone single panel', () => {
      const original = 'panel1';
      const clone = cloneLayoutTree(original);
      expect(clone).toBe('panel1');
      expect(clone).toEqual(original);
    });

    it('should create deep clone of simple tree', () => {
      const original = { ...simpleTree };
      const clone = cloneLayoutTree(original);

      expect(clone).toEqual(original);
      expect(clone).not.toBe(original); // Different object reference

      // Modify clone should not affect original
      if (clone && typeof clone === 'object' && 'splitPercentage' in clone) {
        (clone as LayoutParent<string>).splitPercentage = 80;
        expect((original as LayoutParent<string>).splitPercentage).toBe(60);
      }
    });

    it('should create deep clone of complex tree', () => {
      const original = JSON.parse(JSON.stringify(complexTree)); // Deep copy for testing
      const clone = cloneLayoutTree(original);

      expect(clone).toEqual(original);
      expect(clone).not.toBe(original);

      // Modify nested property in clone
      if (clone && typeof clone === 'object' && 'trailing' in clone) {
        const trailingChild = (clone as LayoutParent<string>).trailing;
        if (typeof trailingChild === 'object' && 'splitPercentage' in trailingChild) {
          (trailingChild as LayoutParent<string>).splitPercentage = 90;
          // Original should be unchanged
          const originalSecond = (original as LayoutParent<string>).trailing;
          expect((originalSecond as LayoutParent<string>).splitPercentage).toBe(75);
        }
      }
    });

    it('should handle number panel IDs', () => {
      const original: LayoutParent<number> = {
        direction: 'row',
        leading: 1,
        trailing: 2,
        splitPercentage: 50,
      };
      const clone = cloneLayoutTree(original);

      expect(clone).toEqual(original);
      expect(clone).not.toBe(original);
    });

    it('should preserve all properties', () => {
      const original: LayoutParent<string> = {
        direction: 'column',
        leading: 'panel1',
        trailing: 'panel2',
        splitPercentage: 33.33,
      };
      const clone = cloneLayoutTree(original) as LayoutParent<string>;

      expect(clone.direction).toBe(original.direction);
      expect(clone.leading).toBe(original.leading);
      expect(clone.trailing).toBe(original.trailing);
      expect(clone.splitPercentage).toBe(original.splitPercentage);
    });
  });
});
