/**
 * @fileoverview Mutable viewport implementation
 *
 * Internal mutable viewport class that implements the readonly Viewport interface.
 * Only the workspace can create and modify these viewport instances.
 */

import { Viewport, ViewportSnapshot } from './types';
import { ProportionalBounds } from '../workspace/types';
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
  public isDefault: boolean = false;
  public isMinimized: boolean = false;
  public isMaximized: boolean = false;
  public isRequired: boolean = false;
  public screenBounds!: ScreenBounds;

  constructor(config: {
    id: string;
    proportionalBounds: ProportionalBounds;
  }) {
    this.id = config.id;
    this.proportionalBounds = config.proportionalBounds;
  }

  mutate(viewport: MutableViewport, viewportSnapshot: ViewportSnapshot, screenBounds: ScreenBounds): void {
    viewport.proportionalBounds = viewportSnapshot.bounds!;
    viewport.isMinimized = viewportSnapshot.isMinimized;
    viewport.isMaximized = viewportSnapshot.isMaximized;
    viewport.screenBounds = screenBounds;
  }

  setMinimized(minimized: boolean): void {
    this.isMinimized = minimized;
    if (minimized) {
      this.isMaximized = false;
    }
  }

  setMaximized(maximized: boolean): void {
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
  }
}
