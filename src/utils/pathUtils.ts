/**
 * @fileoverview Path navigation utilities for binary layout trees
 *
 * This module provides advanced path navigation functions for finding panels,
 * validating paths, and creating balanced tree structures.
 */

import { PanelId, LayoutNode, LayoutParent, LayoutPath } from '../types';
import { isParent, getNodeAtPath } from './treeUtils';

/**
 * Finds the path to a specific panel in the tree.
 * Performs a depth-first search to locate the panel and returns its path.
 *
 * @param tree - The tree to search in
 * @param panelId - The panel ID to find
 * @returns The path to the panel, or null if not found
 *
 * @example
 * ```typescript
 * const tree = {
 *   direction: 'row',
 *   leading: 'panel1',
 *   trailing: { direction: 'column', leading: 'panel2', trailing: 'panel3' }
 * };
 * const path = findPanelPath(tree, 'panel2'); // ['trailing', 'leading']
 * ```
 */
export function findPanelPath<T extends PanelId>(
  tree: LayoutNode<T> | null,
  panelId: T
): LayoutPath | null {
  return findPanelPathRecursive(tree, panelId, []);
}

/**
 * Recursive helper function for findPanelPath.
 *
 * @param node - Current node being examined
 * @param panelId - The panel ID to find
 * @param currentPath - The path to the current node
 * @returns The path to the panel, or null if not found
 */
function findPanelPathRecursive<T extends PanelId>(
  node: LayoutNode<T> | null,
  panelId: T,
  currentPath: LayoutPath
): LayoutPath | null {
  if (node === null) {
    return null;
  }

  // If this is a leaf node, check if it matches
  if (!isParent(node)) {
    return node === panelId ? currentPath : null;
  }

  // Search in leading child
  const leadingPath = findPanelPathRecursive(node.leading, panelId, [...currentPath, 'leading']);
  if (leadingPath !== null) {
    return leadingPath;
  }

  // Search in trailing child
  const trailingPath = findPanelPathRecursive(node.trailing, panelId, [...currentPath, 'trailing']);
  if (trailingPath !== null) {
    return trailingPath;
  }

  return null;
}

/**
 * Gets a node at the specified path and throws an error if it doesn't exist.
 * This is a safe version of getNodeAtPath that provides better error messages.
 *
 * @param tree - The tree to navigate
 * @param path - The path to navigate to
 * @returns The node at the specified path
 * @throws Error if the path does not exist or is invalid
 *
 * @example
 * ```typescript
 * const tree = { direction: 'row', leading: 'panel1', trailing: 'panel2' };
 * const node = getAndAssertNodeAtPathExists(tree, ['leading']); // Returns 'panel1'
 * getAndAssertNodeAtPathExists(tree, ['invalid']); // Throws error
 * ```
 */
export function getAndAssertNodeAtPathExists<T extends PanelId>(
  tree: LayoutNode<T> | null,
  path: LayoutPath
): LayoutNode<T> {
  if (tree === null) {
    throw new Error(`Cannot navigate path ${path.join('/')}: tree is null`);
  }

  const node = getNodeAtPath(tree, path);
  if (node === null) {
    throw new Error(`Path ${path.join('/')} does not exist in the tree`);
  }

  return node;
}

/**
 * Creates a balanced binary tree from an array of panel IDs.
 * The tree is constructed to minimize depth while maintaining left-to-right order.
 *
 * @param panels - Array of panel IDs to arrange in a balanced tree
 * @param direction - The direction for splits ('row' or 'column')
 * @returns A balanced tree structure, or null if panels array is empty
 *
 * @example
 * ```typescript
 * const panels = ['panel1', 'panel2', 'panel3', 'panel4'];
 * const tree = createBalancedTreeFromLeaves(panels, 'row');
 * // Creates a balanced tree with minimal depth
 * ```
 */
export function createBalancedTreeFromLeaves<T extends PanelId>(
  panels: T[],
  direction: 'row' | 'column' = 'row'
): LayoutNode<T> | null {
  if (panels.length === 0) {
    return null;
  }

  if (panels.length === 1) {
    return panels[0];
  }

  // Split the array roughly in half
  const midpoint = Math.ceil(panels.length / 2);
  const leftPanels = panels.slice(0, midpoint);
  const rightPanels = panels.slice(midpoint);

  // Recursively create subtrees
  const leftSubtree = createBalancedTreeFromLeaves(leftPanels, direction);
  const rightSubtree = createBalancedTreeFromLeaves(rightPanels, direction);

  // Create parent node
  const parent: LayoutParent<T> = {
    direction,
    leading: leftSubtree!,
    trailing: rightSubtree!,
    splitPercentage: 50,
  };

  return parent;
}

/**
 * Validates that a path is structurally valid for navigation.
 * Checks that all elements in the path are valid branch directions.
 *
 * @param path - The path to validate
 * @returns True if the path is valid, false otherwise
 *
 * @example
 * ```typescript
 * isValidPath(['leading', 'trailing']); // true
 * isValidPath(['leading', 'invalid']); // false
 * isValidPath([]); // true (empty path is valid)
 * ```
 */
export function isValidPath(path: LayoutPath): boolean {
  return path.every((branch) => branch === 'leading' || branch === 'trailing');
}

/**
 * Gets all possible paths in a tree up to a specified maximum depth.
 * Useful for tree traversal and analysis.
 *
 * @param tree - The tree to get paths from
 * @param maxDepth - Maximum depth to traverse (default: 10)
 * @returns Array of all valid paths in the tree
 *
 * @example
 * ```typescript
 * const tree = {
 *   direction: 'row',
 *   leading: 'panel1',
 *   trailing: { direction: 'column', leading: 'panel2', trailing: 'panel3' }
 * };
 * const paths = getAllPaths(tree); // [[], ['leading'], ['trailing'], ['trailing', 'leading'], ['trailing', 'trailing']]
 * ```
 */
export function getAllPaths<T extends PanelId>(
  tree: LayoutNode<T> | null,
  maxDepth: number = 10
): LayoutPath[] {
  const paths: LayoutPath[] = [];
  collectPathsRecursive(tree, [], paths, maxDepth);
  return paths;
}

/**
 * Recursive helper function for getAllPaths.
 *
 * @param node - Current node being examined
 * @param currentPath - The path to the current node
 * @param paths - Array to collect paths in
 * @param maxDepth - Maximum depth to traverse
 */
function collectPathsRecursive<T extends PanelId>(
  node: LayoutNode<T> | null,
  currentPath: LayoutPath,
  paths: LayoutPath[],
  maxDepth: number
): void {
  if (node === null || currentPath.length >= maxDepth) {
    return;
  }

  // Add current path
  paths.push([...currentPath]);

  // If this is a parent node, recurse into children
  if (isParent(node)) {
    collectPathsRecursive(node.leading, [...currentPath, 'leading'], paths, maxDepth);
    collectPathsRecursive(node.trailing, [...currentPath, 'trailing'], paths, maxDepth);
  }
}

/**
 * Calculates the depth of a tree (maximum path length to any leaf).
 *
 * @param tree - The tree to calculate depth for
 * @returns The maximum depth of the tree (0 for single node, -1 for null)
 *
 * @example
 * ```typescript
 * const tree = {
 *   direction: 'row',
 *   leading: 'panel1',
 *   trailing: { direction: 'column', leading: 'panel2', trailing: 'panel3' }
 * };
 * const depth = getTreeDepth(tree); // 2
 * ```
 */
export function getTreeDepth<T extends PanelId>(tree: LayoutNode<T> | null): number {
  if (tree === null) {
    return -1;
  }

  if (!isParent(tree)) {
    return 0;
  }

  const leftDepth = getTreeDepth(tree.leading);
  const rightDepth = getTreeDepth(tree.trailing);

  return 1 + Math.max(leftDepth, rightDepth);
}
