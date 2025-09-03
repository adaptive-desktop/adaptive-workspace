/**
 * @fileoverview Main LayoutTree class for managing binary layout trees
 * 
 * This module provides the core LayoutTree class that manages immutable
 * binary tree operations for layout management.
 */

import { PanelId, LayoutNode, LayoutParent } from './types';

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
    return new LayoutTree(this.root);
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
}
