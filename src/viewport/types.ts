/**
 * @fileoverview Viewport types and interfaces
 *
 * Core viewport-related types including position and viewport definition.
 */

import { ScreenBounds } from '../workspace';

/**
 * Proportional bounds within workspace (0.0 to 1.0)
 */
export interface ProportionalBounds {
  x: number; // 0.0 to 1.0 (0% to 100% of workspace width)
  y: number; // 0.0 to 1.0 (0% to 100% of workspace height)
  width: number; // 0.0 to 1.0 (0% to 100% of workspace width)
  height: number; // 0.0 to 1.0 (0% to 100% of workspace height)
}

/**
 * Viewport definition
 *
 * A viewport is an individual area within a layout.
 * This interface is readonly - only the workspace can modify viewport properties.
 */
export interface Viewport {
  readonly id: string;
  readonly screenBounds: ScreenBounds;
}
