/**
 * @fileoverview Main LayoutTree class for managing binary layout trees
 *
 * This module provides the core LayoutTree class that manages immutable
 * binary tree operations for layout management.
 */

import { PanelId, LayoutNode, LayoutParent, LayoutPath, LayoutDirection } from './types';
import {
  getNodeAtPath,
  getOtherBranch,
  isValidSplitPercentage,
  getLeaves,
} from './utils/treeUtils';
import {
  findPanelPath,
  getAndAssertNodeAtPathExists,
  getAllPaths,
  getTreeDepth,
} from './utils/pathUtils';

/**
 * Immutable binary tree class for managing layout structures.
 *
 * The LayoutTree represents a spatial arrangement where each parent node
 * splits space between two children. All operations return new tree instances
 * to maintain immutability.
 *
 * @template T - The type of panel identifiers
 *
 * @example
 * ```typescript
 * // Create an empty tree
 * const tree = new LayoutTree<string>();
 *
 * // Create a tree with a single panel
 * const singlePanelTree = new LayoutTree<string>('panel1');
 *
 * // Create a tree with a split
 * const splitTree = new LayoutTree<string>({
 *   direction: 'row',
 *   first: 'panel1',
 *   second: 'panel2',
 *   splitPercentage: 60
 * });
 * ```
 */
export class LayoutTree<T extends PanelId> {
  private readonly root: LayoutNode<T> | null;

  /**
   * Creates a new LayoutTree instance.
   *
   * @param root - The root node of the tree, or null for an empty tree
   */
  constructor(root: LayoutNode<T> | null = null) {
    this.root = root;
  }

  /**
   * Gets the root node of the tree.
   *
   * @returns The root node, or null if the tree is empty
   */
  getRoot(): LayoutNode<T> | null {
    return this.root;
  }

  /**
   * Checks if the tree is empty (has no root node).
   *
   * @returns True if the tree is empty, false otherwise
   */
  isEmpty(): boolean {
    return this.root === null;
  }

  /**
   * Creates a shallow copy of the tree with the same root.
   * This is useful for maintaining immutability while allowing
   * method chaining or other operations.
   *
   * @returns A new LayoutTree instance with the same root
   */
  copy(): LayoutTree<T> {
    return new LayoutTree<T>(this.root);
  }

  /**
   * Checks if two trees are structurally equal.
   * This performs a deep comparison of the tree structure and all node values.
   *
   * @param other - The other tree to compare with
   * @returns True if the trees are structurally equal, false otherwise
   */
  equals(other: LayoutTree<T>): boolean {
    return this.nodesEqual(this.root, other.root);
  }

  /**
   * Helper method to recursively compare two nodes for equality.
   *
   * @param node1 - First node to compare
   * @param node2 - Second node to compare
   * @returns True if nodes are equal, false otherwise
   */
  private nodesEqual(node1: LayoutNode<T> | null, node2: LayoutNode<T> | null): boolean {
    // Both null
    if (node1 === null && node2 === null) {
      return true;
    }

    // One null, one not
    if (node1 === null || node2 === null) {
      return false;
    }

    // Both are leaf nodes (panel IDs)
    if (typeof node1 !== 'object' && typeof node2 !== 'object') {
      return node1 === node2;
    }

    // One is leaf, one is parent
    if (typeof node1 !== 'object' || typeof node2 !== 'object') {
      return false;
    }

    // Both are parent nodes
    const parent1 = node1 as LayoutParent<T>;
    const parent2 = node2 as LayoutParent<T>;

    return (
      parent1.direction === parent2.direction &&
      (parent1.splitPercentage || 50) === (parent2.splitPercentage || 50) &&
      this.nodesEqual(parent1.first, parent2.first) &&
      this.nodesEqual(parent1.second, parent2.second)
    );
  }

  /**
   * Splits a region at the specified path, creating a new parent node with the existing
   * node and a new panel. This operation is immutable and returns a new tree instance.
   *
   * @param path - Path to the node to split
   * @param newPanelId - ID of the new panel to create
   * @param direction - Direction of the split ('row' or 'column')
   * @returns A new LayoutTree with the split applied
   * @throws Error if the path does not exist or is invalid
   *
   * @example
   * ```typescript
   * const tree = new LayoutTree('panel1');
   * const newTree = tree.splitRegion([], 'panel2', 'row');
   * // Result: { direction: 'row', first: 'panel1', second: 'panel2', splitPercentage: 50 }
   * ```
   */
  splitRegion(path: LayoutPath, newPanelId: T, direction: LayoutDirection = 'row'): LayoutTree<T> {
    if (this.root === null) {
      // Create initial split with new panel
      const newRoot: LayoutParent<T> = {
        direction,
        first: newPanelId,
        second: newPanelId,
        splitPercentage: 50,
      };
      return new LayoutTree<T>(newRoot);
    }

    const nodeAtPath = getNodeAtPath(this.root, path);
    if (nodeAtPath === null) {
      throw new Error(`Cannot split: path ${path.join('/')} does not exist`);
    }

    // Create new parent node with existing node and new panel
    const newParent: LayoutParent<T> = {
      direction,
      first: nodeAtPath,
      second: newPanelId,
      splitPercentage: 50,
    };

    // Replace node at path with new parent
    const newRoot = this.replaceNodeAtPath(this.root, path, newParent);
    return new LayoutTree<T>(newRoot);
  }

  /**
   * Removes a region at the specified path. The sibling node takes over the parent's position.
   * This operation is immutable and returns a new tree instance.
   *
   * @param path - Path to the node to remove
   * @returns A new LayoutTree with the node removed
   * @throws Error if the path does not exist or the sibling cannot be found
   *
   * @example
   * ```typescript
   * const tree = new LayoutTree({
   *   direction: 'row',
   *   first: 'panel1',
   *   second: 'panel2'
   * });
   * const newTree = tree.removeRegion(['first']);
   * // Result: 'panel2' (sibling takes over)
   * ```
   */
  removeRegion(path: LayoutPath): LayoutTree<T> {
    if (this.root === null || path.length === 0) {
      return new LayoutTree<T>(null);
    }

    if (path.length === 1) {
      // Removing direct child of root
      const siblingBranch = getOtherBranch(path[0]);
      const sibling = getNodeAtPath(this.root, [siblingBranch]);
      return new LayoutTree<T>(sibling);
    }

    // Remove node and promote sibling
    const parentPath = path.slice(0, -1);
    const removedBranch = path[path.length - 1];
    const siblingBranch = getOtherBranch(removedBranch);
    const siblingPath = [...parentPath, siblingBranch];
    const sibling = getNodeAtPath(this.root, siblingPath);

    if (sibling === null) {
      throw new Error(`Cannot remove: sibling at path ${siblingPath.join('/')} not found`);
    }

    const newRoot = this.replaceNodeAtPath(this.root, parentPath, sibling);
    return new LayoutTree<T>(newRoot);
  }

  /**
   * Resizes a region by updating the split percentage of the parent node at the specified path.
   * This operation is immutable and returns a new tree instance.
   *
   * @param path - Path to the parent node to resize
   * @param percentage - New split percentage (0-100)
   * @returns A new LayoutTree with the updated split percentage
   * @throws Error if the percentage is invalid, path doesn't exist, or path doesn't point to a parent node
   *
   * @example
   * ```typescript
   * const tree = new LayoutTree({
   *   direction: 'row',
   *   first: 'panel1',
   *   second: 'panel2',
   *   splitPercentage: 50
   * });
   * const newTree = tree.resizeRegion([], 70);
   * // Result: same structure but with splitPercentage: 70
   * ```
   */
  resizeRegion(path: LayoutPath, percentage: number): LayoutTree<T> {
    if (!isValidSplitPercentage(percentage)) {
      throw new Error(`Invalid split percentage: ${percentage}. Must be between 0 and 100.`);
    }

    if (this.root === null) {
      throw new Error('Cannot resize: tree is empty');
    }

    const nodeAtPath = getNodeAtPath(this.root, path);
    if (nodeAtPath === null) {
      throw new Error(`Cannot resize: path ${path.join('/')} does not exist`);
    }

    if (typeof nodeAtPath !== 'object' || !('direction' in nodeAtPath)) {
      throw new Error(`Cannot resize: path ${path.join('/')} does not point to a parent node`);
    }

    const updatedNode: LayoutParent<T> = {
      ...nodeAtPath,
      splitPercentage: percentage,
    };

    const newRoot = this.replaceNodeAtPath(this.root, path, updatedNode);
    return new LayoutTree<T>(newRoot);
  }

  /**
   * Private helper method to replace a node at a specific path in the tree.
   * This is used internally by tree operations to create new tree instances.
   *
   * @param root - The root node to start from
   * @param path - Path to the node to replace
   * @param replacement - The new node to place at the path
   * @returns A new tree with the replacement applied
   * @throws Error if the path cannot be navigated
   */
  private replaceNodeAtPath(
    root: LayoutNode<T>,
    path: LayoutPath,
    replacement: LayoutNode<T>
  ): LayoutNode<T> {
    if (path.length === 0) {
      return replacement;
    }

    if (typeof root !== 'object' || !('direction' in root)) {
      throw new Error('Cannot navigate path on leaf node');
    }

    const [branch, ...remainingPath] = path;
    const updatedChild = this.replaceNodeAtPath(
      branch === 'first' ? root.first : root.second,
      remainingPath,
      replacement
    );

    return {
      ...root,
      [branch]: updatedChild,
    };
  }

  /**
   * Gets all panel IDs (leaf nodes) from the tree.
   * This is a convenience method that wraps the getLeaves utility function.
   *
   * @returns Array of all panel IDs in the tree, in depth-first order
   *
   * @example
   * ```typescript
   * const tree = new LayoutTree({
   *   direction: 'row',
   *   first: 'panel1',
   *   second: { direction: 'column', first: 'panel2', second: 'panel3' }
   * });
   * const panels = tree.getPanelIds(); // ['panel1', 'panel2', 'panel3']
   * ```
   */
  getPanelIds(): T[] {
    return getLeaves(this.root);
  }

  /**
   * Checks if the tree contains a specific panel ID.
   *
   * @param panelId - The panel ID to search for
   * @returns True if the panel exists in the tree, false otherwise
   *
   * @example
   * ```typescript
   * const tree = new LayoutTree({ direction: 'row', first: 'panel1', second: 'panel2' });
   * const hasPanel = tree.hasPanel('panel1'); // true
   * const hasOther = tree.hasPanel('panel3'); // false
   * ```
   */
  hasPanel(panelId: T): boolean {
    return this.findPanelPath(panelId) !== null;
  }

  /**
   * Finds the path to a specific panel in the tree.
   * Returns null if the panel is not found.
   *
   * @param panelId - The panel ID to find
   * @returns The path to the panel, or null if not found
   *
   * @example
   * ```typescript
   * const tree = new LayoutTree({
   *   direction: 'row',
   *   first: 'panel1',
   *   second: { direction: 'column', first: 'panel2', second: 'panel3' }
   * });
   * const path = tree.findPanelPath('panel2'); // ['second', 'first']
   * ```
   */
  findPanelPath(panelId: T): LayoutPath | null {
    return findPanelPath(this.root, panelId);
  }

  /**
   * Gets a node at the specified path with error handling.
   * Throws an error if the path does not exist.
   *
   * @param path - The path to navigate to
   * @returns The node at the specified path
   * @throws Error if the path does not exist
   *
   * @example
   * ```typescript
   * const tree = new LayoutTree({ direction: 'row', first: 'panel1', second: 'panel2' });
   * const node = tree.getNodeAtPathSafe(['first']); // Returns 'panel1'
   * tree.getNodeAtPathSafe(['invalid']); // Throws error
   * ```
   */
  getNodeAtPathSafe(path: LayoutPath): LayoutNode<T> {
    return getAndAssertNodeAtPathExists(this.root, path);
  }

  /**
   * Gets all possible paths in the tree up to a specified maximum depth.
   *
   * @param maxDepth - Maximum depth to traverse (default: 10)
   * @returns Array of all valid paths in the tree
   *
   * @example
   * ```typescript
   * const tree = new LayoutTree({
   *   direction: 'row',
   *   first: 'panel1',
   *   second: 'panel2'
   * });
   * const paths = tree.getAllPaths(); // [[], ['first'], ['second']]
   * ```
   */
  getAllPaths(maxDepth: number = 10): LayoutPath[] {
    return getAllPaths(this.root, maxDepth);
  }

  /**
   * Calculates the depth of the tree (maximum path length to any leaf).
   *
   * @returns The maximum depth of the tree (0 for single node, -1 for empty tree)
   *
   * @example
   * ```typescript
   * const tree = new LayoutTree('panel1');
   * const depth = tree.getDepth(); // 0
   *
   * const complexTree = new LayoutTree({
   *   direction: 'row',
   *   first: 'panel1',
   *   second: { direction: 'column', first: 'panel2', second: 'panel3' }
   * });
   * const complexDepth = complexTree.getDepth(); // 2
   * ```
   */
  getDepth(): number {
    return getTreeDepth(this.root);
  }

  /**
   * Gets the total number of panels (leaf nodes) in the tree.
   *
   * @returns The number of panels in the tree
   *
   * @example
   * ```typescript
   * const tree = new LayoutTree({
   *   direction: 'row',
   *   first: 'panel1',
   *   second: { direction: 'column', first: 'panel2', second: 'panel3' }
   * });
   * const count = tree.getPanelCount(); // 3
   * ```
   */
  getPanelCount(): number {
    return this.getPanelIds().length;
  }
}
