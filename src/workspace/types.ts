/**
 * @fileoverview Workspace types and interfaces
 *
 * Core workspace-related types and interfaces.
 */

import { LayoutManager } from '../layout/LayoutManager';
import { Viewport, ProportionalBounds } from '../viewport/types';

/**
 * Screen coordinates and dimensions
 */
export interface ScreenBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Configuration for creating a workspace
 */
export interface WorkspaceConfig {
  id: string;
  position: ScreenBounds;
  layout?: LayoutManager; // Optional, will use default if not provided
}

/**
 * Workspace interface
 *
 * Defines the contract for workspace implementations.
 * The workspace is the public API for managing viewports within a layout.
 */
export interface WorkspaceInterface {
  readonly id: string;
  readonly position: ScreenBounds;
  readonly layout: LayoutManager;

  // Viewport operations - create/split return new viewport, others return success/failure
  /**
   * Create a new viewport in the workspace
   * @param proportionalBounds - Optional bounds (defaults to full workspace if not provided)
   * @returns The new viewport object (shared reference)
   */
  createViewport(proportionalBounds?: ProportionalBounds): Viewport;

  /**
   * Create a viewport adjacent to existing viewports
   * @param existingViewports - Collection of viewports to position relative to
   * @param direction - Direction to place new viewport relative to collection
   * @param size - Optional proportional size for the new viewport
   * @returns The new viewport object (shared reference)
   */
  createAdjacentViewport(
    existingViewportsOrIds: (Viewport | string)[],
    direction: 'up' | 'down' | 'left' | 'right',
    size?: { width?: number; height?: number }
  ): Viewport;

  /**
   * Split a viewport into two viewports
   * @param viewportOrId - Viewport object or ID to split (will be mutated with new bounds)
   * @param direction - Direction to split ('up' | 'down' | 'left' | 'right')
   * @returns The new viewport object (shared reference)
   */
  splitViewport(
    viewportOrId: Viewport | string,
    direction: 'up' | 'down' | 'left' | 'right'
  ): Viewport;

  /**
   * Remove a viewport (adjacent viewports expand to fill space)
   * @param viewport - Viewport object to remove
   * @returns Success/failure of the operation
   */
  removeViewport(viewport: Viewport): boolean;

  /**
   * Swap the positions of two viewports
   * @param viewport1 - First viewport object (bounds will be mutated)
   * @param viewport2 - Second viewport object (bounds will be mutated)
   * @returns Success/failure of the operation
   */
  swapViewports(viewport1: Viewport, viewport2: Viewport): boolean;

  // Viewport queries
  /**
   * Get all viewports in the workspace
   * @returns Array of viewports
   */
  getViewports(): Viewport[];

  /**
   * Check if a viewport exists
   * @param viewportId - ID of the viewport
   * @returns True if viewport exists
   */
  hasViewport(viewportId: string): boolean;

  // Position operations
  /**
   * Update the workspace position
   * @param newPosition - New screen bounds
   */
  updatePosition(newPosition: ScreenBounds): void;
}
