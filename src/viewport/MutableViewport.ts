/**
 * @fileoverview Mutable viewport implementation
 *
 * Internal mutable viewport class that implements the readonly Viewport interface.
 * Only the workspace can create and modify these viewport instances.
 */

import { Viewport, ProportionalBounds } from './types';
import { ScreenBounds } from '../workspace/types';

/**
 * Internal mutable viewport class
 *
 * Only the workspace can create and modify these viewport instances.
 * External consumers see them through the readonly Viewport interface.
 */
export class MutableViewport implements Viewport {
  public id: string;
  public proportionalBounds: ProportionalBounds;
  public screenBounds!: ScreenBounds; // Regular property, initialized in updateScreenBounds()
  public isMinimized: boolean = false;
  public isMaximized: boolean = false;
  public previousBounds?: ScreenBounds;
  private workspaceBounds: ScreenBounds;

  constructor(config: {
    id: string;
    proportionalBounds: ProportionalBounds;
    workspaceBounds: ScreenBounds;
  }) {
    this.id = config.id;
    this.proportionalBounds = config.proportionalBounds;
    this.workspaceBounds = config.workspaceBounds;

    // Calculate initial screen bounds
    this.updateScreenBounds();
  }

  /**
   * Update workspace bounds (called when workspace is resized/moved)
   */
  updateWorkspaceBounds(newWorkspaceBounds: ScreenBounds): void {
    this.workspaceBounds = newWorkspaceBounds;
    this.updateScreenBounds(); // Recalculate screen bounds
  }

  /**
   * Update proportional bounds (called when viewport is resized/moved)
   */
  updateProportionalBounds(newBounds: ProportionalBounds): void {
    this.proportionalBounds = newBounds;
    this.updateScreenBounds(); // Recalculate screen bounds
  }

  /**
   * Recalculate and update screen bounds from current workspace and proportional bounds
   * @private
   */
  private updateScreenBounds(): void {
    this.screenBounds = {
      x: this.workspaceBounds.x + this.workspaceBounds.width * this.proportionalBounds.x,
      y: this.workspaceBounds.y + this.workspaceBounds.height * this.proportionalBounds.y,
      width: this.workspaceBounds.width * this.proportionalBounds.width,
      height: this.workspaceBounds.height * this.proportionalBounds.height,
    };
  }

  /**
   * Set viewport to minimized state
   */
  setMinimized(minimized: boolean): void {
    this.isMinimized = minimized;
    if (minimized) {
      this.isMaximized = false;
    }
  }

  /**
   * Set viewport to maximized state and store previous bounds for restoration
   */
  setMaximized(maximized: boolean): void {
    if (maximized && !this.isMaximized) {
      // Store current bounds before maximizing
      this.previousBounds = { ...this.screenBounds };
    }
    this.isMaximized = maximized;
    if (maximized) {
      this.isMinimized = false;
    }
  }

  /**
   * Restore viewport from minimized or maximized state
   */
  restore(): void {
    this.isMinimized = false;
    this.isMaximized = false;
    // previousBounds will be used by layout manager to restore proportional bounds
  }

  /**
   * Clear the stored previous bounds (used after restoration is complete)
   */
  clearPreviousBounds(): void {
    this.previousBounds = undefined;
  }
}
