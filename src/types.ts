/**
 * @fileoverview Core type definitions for the binary layout tree
 *
 * This module defines the fundamental data structures used throughout the
 * binary layout tree system. All types are generic and framework-agnostic.
 */

/**
 * Represents a unique identifier for a panel.
 * Can be either a string or number to provide flexibility for different use cases.
 */
export type PanelId = string | number;

/**
 * Defines the direction of a layout split.
 * - 'row': Split horizontally (left/right)
 * - 'column': Split vertically (top/bottom)
 */
export type LayoutDirection = 'row' | 'column';

/**
 * Represents which branch of a parent node to navigate to.
 * - 'first': Left child in row layout, top child in column layout
 * - 'second': Right child in row layout, bottom child in column layout
 */
export type LayoutBranch = 'first' | 'second';

/**
 * Represents a path through the binary tree as an array of branch directions.
 * An empty array represents the root node.
 * Example: ['first', 'second'] navigates to root.first.second
 */
export type LayoutPath = LayoutBranch[];

/**
 * Represents a parent node in the binary layout tree.
 * Parent nodes split their space between two children according to the specified direction.
 *
 * @template T - The type of panel identifiers
 */
export interface LayoutParent<T extends PanelId> {
  /** The direction of the split (row = horizontal, column = vertical) */
  direction: LayoutDirection;

  /** The first child node (left in row, top in column) */
  first: LayoutNode<T>;

  /** The second child node (right in row, bottom in column) */
  second: LayoutNode<T>;

  /**
   * The percentage of space allocated to the first child (0-100).
   * Defaults to 50 if not specified.
   * The second child gets the remaining space (100 - splitPercentage).
   */
  splitPercentage?: number;
}

/**
 * Represents any node in the binary layout tree.
 * Can be either a parent node (with children) or a leaf node (panel ID).
 *
 * @template T - The type of panel identifiers
 */
export type LayoutNode<T extends PanelId> = LayoutParent<T> | T;
