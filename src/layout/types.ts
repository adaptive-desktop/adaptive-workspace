/**
 * @fileoverview Layout domain types and interfaces
 *
 * Core layout-related types and interfaces.
 */

import { Viewport, ProportionalBounds } from '../viewport/types';
import { ScreenBounds } from '../workspace/types';

// Temporary interfaces for layout compatibility
interface ViewportPosition {
  row: number;
  column: number;
}

interface ViewportBounds {
  name: string;
  rowStart: number;
  rowEnd: number;
  columnStart: number;
  columnEnd: number;
}

/**
 * Layout Manager Interface
 *
 * Manages the organization of viewports within a workspace.
 * The Workspace contains a Layout, and the LayoutManager handles the layout operations.
 * This is an internal interface - the public API is on the Workspace class.
 *
 * Operation Rules:
 * - removeViewport: Adjacent viewports expand proportionally (configurable in future)
 * - splitViewport: Original content position determined by implementation
 * - swapViewports: Clean exchange of two viewports, no layout changes
 * - insertViewport: New viewport spans the range of specified positions
 */
export interface LayoutManagerInterface<T> {
  // Viewport management operations
  createViewport(proportionalBounds?: ProportionalBounds): Viewport;
  createAdjacentViewport(
    existingViewports: Viewport[],
    direction: 'up' | 'down' | 'left' | 'right',
    size?: { width?: number; height?: number }
  ): Viewport;
  splitViewport(viewport: Viewport, direction: 'up' | 'down' | 'left' | 'right'): Viewport;
  removeViewport(viewport: Viewport): boolean;
  swapViewports(viewport1: Viewport, viewport2: Viewport): boolean;
  getViewports(): Viewport[];
  findViewportById(id: string): Viewport | null;
  hasViewport(viewportId: string): boolean;
  setPosition(position: ScreenBounds): void;

  // Legacy viewport query operations (for compatibility)
  getViewportAt(position: ViewportPosition): T | null;
  getAllViewports(): T[];
  getViewportCount(): number;
  getLayoutTemplate(): T[][];
  getViewportBounds(viewportId: T): ViewportBounds | null;

  // Multi-viewport operations
  insertViewport(
    viewportPositions: ViewportPosition[],
    newViewportId: T,
    direction?: 'up' | 'down' | 'left' | 'right'
  ): boolean;

  // Utility operations
  isValidPosition(position: ViewportPosition): boolean;
  getPositionForViewport(viewportId: T): ViewportPosition | null;
  canSplitViewport(position: ViewportPosition): boolean;
  canRemoveViewport(position: ViewportPosition): boolean;
}
