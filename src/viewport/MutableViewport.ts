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
    isDefault: boolean;
    isMinimized: boolean;
    isMaximized: boolean;
    isRequired: boolean;
  }) {
    this.id = config.id;
    this.proportionalBounds = config.proportionalBounds;
    this.isDefault = config.isDefault;
    this.isMaximized = config.isMaximized;
    this.isMinimized = config.isMinimized;
    this.isRequired = config.isRequired;
  }

  mutate(viewportSnapshot: ViewportSnapshot, screenBounds: ScreenBounds): void {
    this.proportionalBounds = viewportSnapshot.bounds!;
    this.isDefault = viewportSnapshot.isDefault;
    this.isMinimized = viewportSnapshot.isMinimized;
    this.isMaximized = viewportSnapshot.isMaximized;
    this.isRequired = viewportSnapshot.isRequired;
    this.screenBounds = screenBounds;
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
