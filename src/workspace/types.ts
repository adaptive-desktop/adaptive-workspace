import { Viewport, ViewportSnapshot } from '../viewport/types';
import { ViewportSnapshotCollection } from '../viewport/snapshot/ViewportSnapshotCollection';
import { WorkspaceContextCollection } from './context/WorkspaceContextCollection';
import { IdGenerator } from '../shared';
/**
 * @fileoverview Workspace types and interfaces
 *
 * Core workspace-related types and interfaces.
 */

/**
 * WorkspaceContext: describes the current display environment and viewport arrangement.
 */
export interface WorkspaceContext {
  aspectRatio: number;
  sizeCategory: 'sm' | 'md' | 'lg' | 'xl';
  deviceType:
    | 'small-tablet'
    | 'large-tablet'
    | 'compact-laptop'
    | 'standard-laptop'
    | 'large-laptop'
    | 'desktop'
    | 'ultrawide'
    | 'wall-display'
    | 'tv'
    | 'phone'
    | 'phablet'
    | 'foldable';
  id?: string;
  maxScreenBounds: ScreenBounds;
  minimumViewportScreenHeight: number;
  minimumViewportScreenWidth: number;
  name?: string;
  orientation: 'landscape' | 'portrait';
  viewportSnapshots: ViewportSnapshotCollection;
}

export interface ProportionalBounds {
  x: number; // 0.0 to 1.0 (0% to 100% of workspace width)
  y: number; // 0.0 to 1.0 (0% to 100% of workspace height)
  width: number; // 0.0 to 1.0 (0% to 100% of workspace width)
  height: number; // 0.0 to 1.0 (0% to 100% of workspace height)
}

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
  idGenerator: IdGenerator;
  name: string;
  workspaceContexts: WorkspaceContextCollection;
}

export interface WorkspaceSnapshot {
  id: string;
  name: string;
  workspaceContexts: WorkspaceContextSnapshot[];
}

export interface WorkspaceContextSnapshot {
  aspectRatio: number;
  sizeCategory: 'sm' | 'md' | 'lg' | 'xl';
  deviceType:
    | 'small-tablet'
    | 'large-tablet'
    | 'compact-laptop'
    | 'standard-laptop'
    | 'large-laptop'
    | 'desktop'
    | 'ultrawide'
    | 'wall-display'
    | 'tv'
    | 'phone'
    | 'phablet'
    | 'foldable';
  id: string;
  maxScreenBounds: ScreenBounds;
  minimumViewportScreenHeight: number;
  minimumViewportScreenWidth: number;
  name: string;
  orientation: 'landscape' | 'portrait';
  viewportSnapshots: ViewportSnapshot[];
}

/**
 * Workspace interface
 *
 * Defines the contract for workspace implementations.
 * The workspace is the public API for managing viewports within a layout.
 */
export interface WorkspaceInterface {
  readonly id: string;
  readonly name: string;
  readonly screenBounds: ScreenBounds;
  readonly viewports: Map<string, Viewport>;

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
   * @returns The new viewport object (shared reference)
   */
  createAdjacentViewport(
    existingViewportsOrIds: (Viewport | string)[],
    direction: 'up' | 'down' | 'left' | 'right'
  ): Viewport;

  /**
   * Split a viewport into two viewports
   * @param viewport - Viewport object or ID to split
   * @param direction - Direction to split ('up' | 'down' | 'left' | 'right')
   * @param ratio - Split ratio (defaults to 0.5, will be clamped to respect minimum viewport sizes)
   * @returns Object containing the ID of the newly created viewport
   */
  splitViewport(
    viewport: Viewport | string,
    direction: 'up' | 'down' | 'left' | 'right',
    ratio?: number
  ): Viewport;

  /**
   * Remove a viewport
   * @param viewport - Viewport object or ID to remove
   * @returns Success/failure of the operation
   */
  removeViewport(viewport: Viewport | string): boolean;

  /**
   * Swap the positions of two viewports
   * @param viewport1 - First viewport object (bounds will be mutated)
   * @param viewport2 - Second viewport object (bounds will be mutated)
   * @returns Success/failure of the operation
   */
  swapViewports(viewport1: Viewport, viewport2: Viewport): boolean;

  /**
   * Check if a viewport exists
   * @param viewportId - ID of the viewport
   * @returns True if viewport exists
   */
  hasViewport(viewportId: string): boolean;

  /**
   * Minimize a viewport (not supported yet)
   * @param viewportId - ID of the viewport to minimize
   * @returns Success/failure of the operation
   */
  minimizeViewport(viewport: Viewport | string): boolean;

  /**
   * Maximize a viewport (not supported yet)
   * @param viewportId - ID of the viewport to maximize
   * @returns Success/failure of the operation
   */
  maximizeViewport(viewport: Viewport | string): boolean;

  /**
   * Restore a viewport (not supported yet)
   * @param viewportId - ID of the viewport to restore
   * @returns Success/failure of the operation
   */
  restoreViewport(viewport: Viewport | string): boolean;

  // Position operations
  /**
   * Set the workspace screen bounds (position and size)
   * @param screenBounds - New screen bounds
   */
  setScreenBounds(screenBounds: ScreenBounds): void;
}
