/**
 * @fileoverview Tree utility functions for binary layout tree operations
 *
 * This module provides utility functions for tree traversal, type checking,
 * and basic tree operations that are used throughout the layout system.
 */

import {
  PanelId,
  LayoutNode,
  LayoutParent,
  LayoutPath,
  LayoutBranch,
  LayoutDirection,
} from '../types';

/**
 * Type guard to check if a node is a parent node (has children).
 *
 * @param node - The node to check
 * @returns True if the node is a parent node, false if it's a leaf (panel ID)
 *
 * @example
 * ```typescript
 * const node: LayoutNode<string> = { direction: 'row', leading: 'a', trailing: 'b' };
 * if (isParent(node)) {
 *   console.log(node.direction); // TypeScript knows this is safe
 * }
 * ```
 */
export function isParent<T extends PanelId>(node: LayoutNode<T>): node is LayoutParent<T> {
  return typeof node === 'object' && node !== null && 'direction' in node;
}

/**
 * Extracts all panel IDs (leaf nodes) from a tree structure.
 * Performs a depth-first traversal to collect all leaf nodes.
 *
 * @param tree - The tree or subtree to extract leaves from
 * @returns Array of all panel IDs in the tree, in depth-first order
 *
 * @example
 * ```typescript
 * const tree = {
 *   direction: 'row',
 *   leading: 'panel1',
 *   trailing: { direction: 'column', leading: 'panel2', trailing: 'panel3' }
 * };
 * const leaves = getLeaves(tree); // ['panel1', 'panel2', 'panel3']
 * ```
 */
export function getLeaves<T extends PanelId>(tree: LayoutNode<T> | null): T[] {
  if (tree == null) {
    return [];
  } else if (isParent(tree)) {
    return getLeaves(tree.leading).concat(getLeaves(tree.trailing));
  } else {
    return [tree];
  }
}

/**
 * Navigates to a specific node in the tree using a path array.
 * Each element in the path specifies which branch to take at each level.
 *
 * @param tree - The tree to navigate
 * @param path - Array of branch directions to follow
 * @returns The node at the specified path, or null if the path is invalid
 *
 * @example
 * ```typescript
 * const tree = {
 *   direction: 'row',
 *   leading: 'panel1',
 *   trailing: { direction: 'column', leading: 'panel2', trailing: 'panel3' }
 * };
 *
 * getNodeAtPath(tree, []) // Returns the root node
 * getNodeAtPath(tree, ['leading']) // Returns 'panel1'
 * getNodeAtPath(tree, ['trailing', 'leading']) // Returns 'panel2'
 * getNodeAtPath(tree, ['invalid', 'path']) // Returns null
 * ```
 */
export function getNodeAtPath<T extends PanelId>(
  tree: LayoutNode<T> | null,
  path: LayoutPath
): LayoutNode<T> | null {
  if (tree == null || path.length === 0) {
    return tree;
  }

  if (!isParent(tree)) {
    return null; // Cannot navigate further on leaf node
  }

  const [branch, ...remainingPath] = path;

  // Validate that the branch is valid
  if (branch !== 'leading' && branch !== 'trailing') {
    return null;
  }

  const nextNode = branch === 'leading' ? tree.leading : tree.trailing;
  return getNodeAtPath(nextNode, remainingPath);
}

/**
 * Gets the opposite branch direction.
 *
 * @param branch - The branch to get the opposite of
 * @returns The opposite branch ('leading' -> 'trailing', 'trailing' -> 'leading')
 *
 * @example
 * ```typescript
 * getOtherBranch('leading') // Returns 'trailing'
 * getOtherBranch('trailing') // Returns 'leading'
 * ```
 */
export function getOtherBranch(branch: LayoutBranch): LayoutBranch {
  return branch === 'leading' ? 'trailing' : 'leading';
}

/**
 * Gets the opposite layout direction.
 *
 * @param direction - The direction to get the opposite of
 * @returns The opposite direction ('row' -> 'column', 'column' -> 'row')
 *
 * @example
 * ```typescript
 * getOtherDirection('row') // Returns 'column'
 * getOtherDirection('column') // Returns 'row'
 * ```
 */
export function getOtherDirection(direction: LayoutDirection): LayoutDirection {
  return direction === 'row' ? 'column' : 'row';
}

/**
 * Validates that a split percentage is within the valid range.
 *
 * @param percentage - The percentage to validate
 * @returns True if the percentage is valid (0-100), false otherwise
 *
 * @example
 * ```typescript
 * isValidSplitPercentage(50) // Returns true
 * isValidSplitPercentage(0) // Returns true
 * isValidSplitPercentage(100) // Returns true
 * isValidSplitPercentage(-10) // Returns false
 * isValidSplitPercentage(150) // Returns false
 * ```
 */
export function isValidSplitPercentage(percentage: number): boolean {
  return (
    typeof percentage === 'number' && !isNaN(percentage) && percentage >= 0 && percentage <= 100
  );
}

/**
 * Normalizes a split percentage, providing a default value if undefined.
 *
 * @param percentage - The percentage to normalize (may be undefined)
 * @returns The normalized percentage (defaults to 50 if undefined)
 *
 * @example
 * ```typescript
 * normalizeSplitPercentage(75) // Returns 75
 * normalizeSplitPercentage(undefined) // Returns 50
 * ```
 */
export function normalizeSplitPercentage(percentage: number | undefined): number {
  return percentage ?? 50;
}
