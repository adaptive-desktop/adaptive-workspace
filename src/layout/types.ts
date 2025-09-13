/**
 * @fileoverview Layout domain types and interfaces
 *
 * Core layout-related types and interfaces.
// Event Emitter interface for layout context events
export interface LayoutEventEmitter {
  on(event: LayoutEventType, handler: (payload: any) => void): void;
  off(event: LayoutEventType, handler: (payload: any) => void): void;
  emit(event: LayoutEventType, payload: any): void;
}

// Event types for layout context management
export type LayoutEventType =
  | 'contextCreated'
  | 'contextUpdated'
  | 'contextRemoved'
  | 'snapshotCreated'
  | 'snapshotRestored';
 */

import { Viewport, ProportionalBounds } from '../viewport/types';
import { ScreenBounds } from '../workspace/types';

/**
 * Layout context representing the current display environment
 */
export interface LayoutContext {
  orientation: 'landscape' | 'portrait';
  aspectRatio: number;
  breakpoint: 'sm' | 'md' | 'lg' | 'xl';
  sizeCategory: 'small' | 'medium' | 'large' | 'extra-large';
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
  screenBounds: ScreenBounds;
}

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
