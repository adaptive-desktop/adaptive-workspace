/**
 * @fileoverview Helper functions for layout actions
 *
 * This module provides utility functions that can be used to implement
 * layout actions and operations on the binary layout tree.
 */

import { LayoutTree } from '../layout/LayoutTree';
import { PanelId, LayoutPath, LayoutDirection, InsertPosition, LayoutActions } from '../shared/types';

/**
 * Create a layout actions object for a specific panel
 */
export function createLayoutActions<T extends PanelId>(
  tree: LayoutTree<T>,
  panelPath: LayoutPath,
  onTreeChange: (newTree: LayoutTree<T>) => void
): LayoutActions<T> {
  return {
    splitCurrentRegion: (direction: LayoutDirection, newPanelId?: T): T => {
      // Generate a new panel ID if not provided
      const panelId = newPanelId ?? generatePanelId<T>();
      const newTree = tree.splitRegion(panelPath, panelId, direction);
      onTreeChange(newTree);
      return panelId;
    },

    removeCurrentRegion: (): void => {
      const newTree = tree.removeRegion(panelPath);
      onTreeChange(newTree);
    },

    resizeCurrentRegion: (percentage: number): void => {
      const newTree = tree.resizeRegion(panelPath, percentage);
      onTreeChange(newTree);
    },

    expandCurrentRegion: (percentage?: number): void => {
      // Default to 80% if no percentage provided
      const targetPercentage = percentage ?? 80;
      const newTree = tree.resizeRegion(panelPath, targetPercentage);
      onTreeChange(newTree);
    },

    lockCurrentRegion: (locked: boolean): void => {
      const newTree = tree.lockRegion(panelPath, locked);
      onTreeChange(newTree);
    },

    movePanel: (targetPath: LayoutPath, position: InsertPosition): void => {
      const newTree = tree.movePanel(panelPath, targetPath, position);
      onTreeChange(newTree);
    },
  };
}

/**
 * Generate a unique panel ID (basic implementation)
 * In a real application, this would use a more sophisticated ID generation strategy
 */
function generatePanelId<T extends PanelId>(): T {
  // This is a simple implementation - in practice you'd want something more robust
  return `panel_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` as T;
}

/**
 * Find the best split direction based on current dimensions
 */
export function getBestSplitDirection(width: number, height: number): LayoutDirection {
  // Split along the longer dimension to create more balanced regions
  return width > height ? 'row' : 'column';
}

/**
 * Calculate optimal split percentage based on content requirements
 */
export function calculateOptimalSplit(
  leadingMinSize: number,
  trailingMinSize: number,
  totalSize: number
): number {
  const totalMinSize = leadingMinSize + trailingMinSize;

  if (totalMinSize >= totalSize) {
    // Not enough space - give minimum to trailing, rest to leading
    return Math.max(0, Math.min(100, ((totalSize - trailingMinSize) / totalSize) * 100));
  }

  // Calculate proportional split based on minimum requirements
  const leadingRatio = leadingMinSize / totalMinSize;
  return Math.max(10, Math.min(90, leadingRatio * 100));
}

/**
 * Check if a region can be split given current constraints
 */
export function canSplitRegion<T extends PanelId>(
  tree: LayoutTree<T>,
  path: LayoutPath,
  _minPanelSize: number = 100
): boolean {
  // This would need actual bounds information to work properly
  // For now, just check if the path exists and points to a panel
  try {
    const node = tree.getNodeAtPathSafe(path);
    return node !== null && typeof node !== 'object';
  } catch {
    return false;
  }
}

/**
 * Find the closest resizable parent region
 */
export function findResizableParent<T extends PanelId>(
  tree: LayoutTree<T>,
  path: LayoutPath
): LayoutPath | null {
  // Walk up the tree to find a parent that can be resized
  for (let i = path.length - 1; i >= 0; i--) {
    const parentPath = path.slice(0, i);
    if (tree.canResize(parentPath, 50)) {
      return parentPath;
    }
  }
  return null;
}

/**
 * Get all possible insertion positions for a panel
 */
export function getInsertionPositions<T extends PanelId>(
  tree: LayoutTree<T>,
  targetPath: LayoutPath
): InsertPosition[] {
  const positions: InsertPosition[] = [];

  // Always allow replace
  positions.push('replace');

  // Check if we can split (add before/after)
  if (canSplitRegion(tree, targetPath)) {
    positions.push('before', 'after');
  }

  return positions;
}

/**
 * Calculate the impact of removing a region
 */
export function calculateRemovalImpact<T extends PanelId>(
  tree: LayoutTree<T>,
  path: LayoutPath
): {
  affectedPanels: T[];
  siblingWillExpand: boolean;
  newTreeDepth: number;
} {
  const originalPanels = tree.getPanelIds();
  const originalDepth = tree.getDepth();

  try {
    const newTree = tree.removeRegion(path);
    const newPanels = newTree.getPanelIds();
    const newDepth = newTree.getDepth();

    const affectedPanels = originalPanels.filter((panel) => !newPanels.includes(panel));

    return {
      affectedPanels,
      siblingWillExpand: newPanels.length === originalPanels.length - 1,
      newTreeDepth: newDepth,
    };
  } catch {
    return {
      affectedPanels: [],
      siblingWillExpand: false,
      newTreeDepth: originalDepth,
    };
  }
}

/**
 * Validate a layout action before executing it
 */
export function validateLayoutAction<T extends PanelId>(
  tree: LayoutTree<T>,
  action: keyof LayoutActions<T>,
  path: LayoutPath,
  ...args: unknown[]
): { valid: boolean; reason?: string } {
  switch (action) {
    case 'splitCurrentRegion':
      if (!canSplitRegion(tree, path)) {
        return { valid: false, reason: 'Region cannot be split' };
      }
      break;

    case 'removeCurrentRegion':
      if (tree.getPanelIds().length <= 1) {
        return { valid: false, reason: 'Cannot remove the last panel' };
      }
      break;

    case 'resizeCurrentRegion': {
      const percentage = args[0] as number;
      if (!tree.canResize(path, percentage)) {
        return { valid: false, reason: 'Region cannot be resized to this percentage' };
      }
      break;
    }

    case 'lockCurrentRegion':
      // Locking is generally always allowed
      break;

    case 'movePanel': {
      const targetPath = args[0] as LayoutPath;
      if (JSON.stringify(path) === JSON.stringify(targetPath)) {
        return { valid: false, reason: 'Cannot move panel to itself' };
      }
      break;
    }

    default:
      return { valid: false, reason: 'Unknown action' };
  }

  return { valid: true };
}
