/**
 * @fileoverview Serialization utilities for binary layout trees
 *
 * This module provides functions for serializing and deserializing binary layout trees
 * to/from JSON format, enabling persistence and data exchange.
 */

import {
  PanelId,
  LayoutNode,
  LayoutParent,
  LayoutDirection,
  RegionConstraints,
} from '../shared/types';
import { isParent, isValidSplitPercentage } from './treeUtils';

/**
 * Serializable representation of a layout tree.
 * This is the JSON-safe format used for persistence and data exchange.
 */
export interface SerializableLayoutTree {
  /** Version of the serialization format for future compatibility */
  version: string;
  /** The serialized tree data */
  tree: SerializableLayoutNode | null;
}

/**
 * Serializable representation of a layout node.
 * Can be either a panel ID or a parent node with children.
 */
export type SerializableLayoutNode = SerializableLayoutParent | PanelId;

/**
 * Serializable representation of a parent node.
 */
export interface SerializableLayoutParent {
  /** The direction of the split */
  direction: LayoutDirection;
  /** The leading child node */
  leading: SerializableLayoutNode;
  /** The trailing child node */
  trailing: SerializableLayoutNode;
  /** The split percentage (optional, defaults to 50) */
  splitPercentage?: number;
  /** Constraints for child regions */
  constraints?: RegionConstraints;
}

/**
 * Current version of the serialization format.
 */
export const SERIALIZATION_VERSION = '0.2.0';

/**
 * Serializes a layout tree to a JSON-safe format.
 * The resulting object can be safely converted to JSON and stored or transmitted.
 *
 * @param tree - The tree to serialize
 * @returns A serializable representation of the tree
 *
 * @example
 * ```typescript
 * const tree = {
 *   direction: 'row',
 *   leading: 'panel1',
 *   trailing: 'panel2',
 *   splitPercentage: 60
 * };
 * const serialized = serializeLayoutTree(tree);
 * const json = JSON.stringify(serialized);
 * ```
 */
export function serializeLayoutTree<T extends PanelId>(
  tree: LayoutNode<T> | null
): SerializableLayoutTree {
  return {
    version: SERIALIZATION_VERSION,
    tree: serializeLayoutNode(tree),
  };
}

/**
 * Serializes a layout node to a JSON-safe format.
 *
 * @param node - The node to serialize
 * @returns A serializable representation of the node
 */
function serializeLayoutNode<T extends PanelId>(
  node: LayoutNode<T> | null
): SerializableLayoutNode | null {
  if (node === null) {
    return null;
  }

  if (!isParent(node)) {
    return node;
  }

  return {
    direction: node.direction,
    leading: serializeLayoutNode(node.leading)!,
    trailing: serializeLayoutNode(node.trailing)!,
    splitPercentage: node.splitPercentage,
    constraints: node.constraints,
  };
}

/**
 * Deserializes a layout tree from a JSON-safe format.
 * Validates the format and structure during deserialization.
 *
 * @param serialized - The serialized tree data
 * @returns The deserialized tree
 * @throws Error if the serialized data is invalid
 *
 * @example
 * ```typescript
 * const json = '{"version":"1.0.0","tree":{"direction":"row","leading":"panel1","trailing":"panel2"}}';
 * const serialized = JSON.parse(json);
 * const tree = deserializeLayoutTree(serialized);
 * ```
 */
export function deserializeLayoutTree<T extends PanelId>(
  serialized: SerializableLayoutTree
): LayoutNode<T> | null {
  if (!serialized || typeof serialized !== 'object') {
    throw new Error('Invalid serialized data: must be an object');
  }

  if (!serialized.version) {
    throw new Error('Invalid serialized data: missing version');
  }

  if (serialized.version !== SERIALIZATION_VERSION) {
    throw new Error(
      `Unsupported serialization version: ${serialized.version}. Expected: ${SERIALIZATION_VERSION}.`
    );
  }

  if (!('tree' in serialized)) {
    throw new Error('Invalid serialized data: missing tree property');
  }

  return deserializeLayoutNode<T>(serialized.tree);
}

/**
 * Deserializes a layout node from a JSON-safe format.
 *
 * @param node - The serialized node data
 * @returns The deserialized node
 * @throws Error if the node data is invalid
 */
function deserializeLayoutNode<T extends PanelId>(
  node: SerializableLayoutNode | null
): LayoutNode<T> | null {
  if (node === null) {
    return null;
  }

  // If it's not an object, it's a panel ID
  if (typeof node !== 'object') {
    return node as T;
  }

  // Validate parent node structure
  if (!('direction' in node) || !('leading' in node) || !('trailing' in node)) {
    throw new Error('Invalid parent node: missing required properties');
  }

  const parent = node as SerializableLayoutParent;

  // Validate direction
  if (parent.direction !== 'row' && parent.direction !== 'column') {
    throw new Error(`Invalid direction: ${parent.direction}. Must be 'row' or 'column'`);
  }

  // Validate split percentage if present
  if (parent.splitPercentage !== undefined && !isValidSplitPercentage(parent.splitPercentage)) {
    throw new Error(
      `Invalid split percentage: ${parent.splitPercentage}. Must be between 0 and 100`
    );
  }

  // Recursively deserialize children
  const leading = deserializeLayoutNode<T>(parent.leading);
  const trailing = deserializeLayoutNode<T>(parent.trailing);

  if (leading === null || trailing === null) {
    throw new Error('Invalid parent node: children cannot be null');
  }

  return {
    direction: parent.direction,
    leading,
    trailing,
    splitPercentage: parent.splitPercentage,
    constraints: parent.constraints,
  } as LayoutParent<T>;
}

/**
 * Validates that a serialized layout tree has the correct structure.
 * This is useful for checking data before attempting deserialization.
 *
 * @param data - The data to validate
 * @returns True if the data appears to be a valid serialized tree
 *
 * @example
 * ```typescript
 * const json = '{"version":"1.0.0","tree":{"direction":"row","leading":"panel1","trailing":"panel2"}}';
 * const data = JSON.parse(json);
 * if (isValidSerializedTree(data)) {
 *   const tree = deserializeLayoutTree(data);
 * }
 * ```
 */
export function isValidSerializedTree(data: unknown): data is SerializableLayoutTree {
  try {
    if (!data || typeof data !== 'object') {
      return false;
    }

    const obj = data as Record<string, unknown>;

    // Check required properties
    if (typeof obj.version !== 'string' || !('tree' in obj)) {
      return false;
    }

    // Check version
    if (obj.version !== SERIALIZATION_VERSION) {
      return false;
    }

    // Validate tree structure recursively
    return isValidSerializedNode(obj.tree);
  } catch {
    return false;
  }
}

/**
 * Validates that a serialized node has the correct structure.
 *
 * @param node - The node data to validate
 * @returns True if the node appears to be valid
 */
function isValidSerializedNode(node: unknown): boolean {
  if (node === null) {
    return true;
  }

  // Panel ID (leaf node)
  if (typeof node === 'string' || typeof node === 'number') {
    return true;
  }

  // Parent node
  if (typeof node !== 'object') {
    return false;
  }

  const obj = node as Record<string, unknown>;

  // Check required properties
  if (!('direction' in obj) || !('leading' in obj) || !('trailing' in obj)) {
    return false;
  }

  // Validate direction
  if (obj.direction !== 'row' && obj.direction !== 'column') {
    return false;
  }

  // Validate split percentage if present
  if ('splitPercentage' in obj && obj.splitPercentage !== undefined) {
    if (typeof obj.splitPercentage !== 'number' || !isValidSplitPercentage(obj.splitPercentage)) {
      return false;
    }
  }

  // Recursively validate children
  return isValidSerializedNode(obj.leading) && isValidSerializedNode(obj.trailing);
}

/**
 * Creates a deep clone of a layout tree.
 * This is useful for creating independent copies of tree structures.
 *
 * @param tree - The tree to clone
 * @returns A deep copy of the tree
 *
 * @example
 * ```typescript
 * const original = { direction: 'row', leading: 'panel1', trailing: 'panel2' };
 * const clone = cloneLayoutTree(original);
 * // clone is completely independent of original
 * ```
 */
export function cloneLayoutTree<T extends PanelId>(
  tree: LayoutNode<T> | null
): LayoutNode<T> | null {
  // Use serialization/deserialization for deep cloning
  const serialized = serializeLayoutTree(tree);
  return deserializeLayoutTree<T>(serialized);
}
