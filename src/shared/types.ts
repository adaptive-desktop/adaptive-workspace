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
 * - 'leading': Left child in row layout, top child in column layout
 * - 'trailing': Right child in row layout, bottom child in column layout
 */
export type LayoutBranch = 'leading' | 'trailing';

/**
 * Represents a path through the binary tree as an array of branch directions.
 * An empty array represents the root node.
 * Example: ['leading', 'trailing'] navigates to root.leading.trailing
 */
export type LayoutPath = LayoutBranch[];

/**
 * Position for inserting panels relative to existing panels
 */
export type InsertPosition = 'before' | 'after' | 'replace';

/**
 * Common dimensional interface used across all components
 */
export interface Dimensions {
  width: number;
  height: number;
}

/**
 * Complete bounds information including position and size
 */
export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Workspace-level bounds with safe area information
 */
export interface WorkspaceBounds extends Bounds {
  safeArea?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
}

/**
 * Region-specific bounds with path and constraint information
 */
export interface RegionBounds extends Bounds {
  path: LayoutPath;
  constraints?: RegionConstraints;
}

/**
 * Constraints that can be applied to a single child region
 */
export interface ChildConstraints {
  /** Child has fixed size and cannot be resized */
  locked?: boolean;
  /** Minimum size in pixels */
  minSize?: number;
  /** Maximum size in pixels */
  maxSize?: number;
  /** Whether this child can be collapsed to zero size */
  collapsible?: boolean;
  /** Resize priority (higher = more likely to grow/shrink) */
  priority?: number;
}

/**
 * Constraints that can be applied to regions within a parent node
 */
export interface RegionConstraints {
  /** Constraints for the leading child (left/top) */
  leading?: ChildConstraints;
  /** Constraints for the trailing child (right/bottom) */
  trailing?: ChildConstraints;
}

/**
 * Layout actions available to panels for requesting layout changes
 */
export interface LayoutActions<T extends PanelId> {
  splitCurrentRegion: (direction: LayoutDirection, newPanelId?: T) => T;
  removeCurrentRegion: () => void;
  resizeCurrentRegion: (percentage: number) => void;
  expandCurrentRegion: (percentage?: number) => void;
  lockCurrentRegion: (locked: boolean) => void;
  movePanel: (targetPath: LayoutPath, position: InsertPosition) => void;
}

/**
 * Complete props passed to panel render function
 * Provides 1-to-1 region-to-panel relationship with full context
 */
export interface PanelRenderProps<T extends PanelId> {
  /** Unique identifier for this panel */
  panelId: T;
  /** Path to this panel in the layout tree */
  path: LayoutPath;
  /** Complete bounds information including position and constraints */
  bounds: RegionBounds;
  /** Dimensions for convenience (extracted from bounds) */
  dimensions: Dimensions;
  /** Actions this panel can perform on the layout */
  layoutActions: LayoutActions<T>;
}

/**
 * Panel render function signature
 * Framework-agnostic - returns any renderable content
 */
export type PanelRenderer<T extends PanelId> = (props: PanelRenderProps<T>) => unknown;

/**
 * Represents a parent node in the binary layout tree.
 * Parent nodes split their space between two children according to the specified direction.
 *
 * @template T - The type of panel identifiers
 */
export interface LayoutParent<T extends PanelId> {
  /** The direction of the split (row = horizontal, column = vertical) */
  direction: LayoutDirection;

  /** The leading child node (left in row, top in column) */
  leading: LayoutNode<T>;

  /** The trailing child node (right in row, bottom in column) */
  trailing: LayoutNode<T>;

  /**
   * The percentage of space allocated to the leading child (0-100).
   * Defaults to 50 if not specified.
   * The trailing child gets the remaining space (100 - splitPercentage).
   */
  splitPercentage?: number;

  /** Constraints for child regions */
  constraints?: RegionConstraints;
}

/**
 * Represents any node in the binary layout tree.
 * Can be either a parent node (with children) or a leaf node (panel ID).
 *
 * @template T - The type of panel identifiers
 */
export type LayoutNode<T extends PanelId> = LayoutParent<T> | T;
