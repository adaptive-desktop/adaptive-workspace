/**
 * @fileoverview Layout domain types and interfaces
 *
 * Core layout-related types and interfaces.
 */

import { Viewport, ProportionalBounds } from '../viewport/types';
import { ScreenBounds } from '../workspace/types';

/**
 * Layout Manager Interface
 *
 * Manages the organization of viewports within a workspace.
 * The Workspace contains a Layout, and the LayoutManager handles the layout operations.
 * This is an internal interface - the public API is on the Workspace class.
 *
 * Viewport state operations (minimize/maximize/restore) return boolean success indicators.
 */
export interface LayoutManagerInterface {
  createAdjacentViewport(
    existingViewports: Viewport[],
    direction: 'up' | 'down' | 'left' | 'right',
    size?: { width?: number; height?: number }
  ): Viewport;
  createViewport(proportionalBounds?: ProportionalBounds): Viewport;
  splitViewport(viewport: Viewport, direction: 'up' | 'down' | 'left' | 'right'): Viewport;

  minimizeViewport(viewport: Viewport): boolean;
  maximizeViewport(viewport: Viewport): boolean;
  restoreViewport(viewport: Viewport): boolean;

  getViewports(): Viewport[];
  findViewportById(id: string): Viewport | null;
  setScreenBounds(screenBounds: ScreenBounds): void;
  getViewportCount(): number;
}
