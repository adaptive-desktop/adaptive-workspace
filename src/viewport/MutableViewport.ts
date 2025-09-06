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
}
