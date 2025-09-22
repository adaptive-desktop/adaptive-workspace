import { WorkspaceInterface, WorkspaceConfig, ScreenBounds } from './types';
import { Viewport, ViewportManager } from '../viewport';
import { IdGenerator } from '../shared/types';

export class Workspace implements WorkspaceInterface {
  public readonly id: string;
  public readonly screenBounds: ScreenBounds;
  public readonly viewportManager: ViewportManager;
  private readonly idGenerator: IdGenerator;

  constructor(config: WorkspaceConfig) {
    this.id = config.id;
    this.screenBounds = config.screenBounds;
    this.idGenerator = config.idGenerator;
    this.viewportManager = config.viewportManager || this.createDefaultLayout();

    // Initialize viewport manager with workspace screen bounds
    this.viewportManager.setScreenBounds(this.screenBounds);
  }

  // Viewport operations
  /**
   * Create a new viewport in the workspace
   */
  createViewport(proportionalBounds?: ProportionalBounds): Viewport {
    // Delegate to viewport manager (it will find optimal placement if no bounds provided)
    return this.viewportManager.createViewport(proportionalBounds);
  }

  /**
   * Create a viewport adjacent to existing viewports
   */
  createAdjacentViewport(
    existingViewportsOrIds: (Viewport | string)[],
    direction: 'up' | 'down' | 'left' | 'right',
    size?: { width?: number; height?: number }
  ): Viewport {
    // Resolve any IDs to viewport objects
    const existingViewports = existingViewportsOrIds.map((viewportOrId) => {
      if (typeof viewportOrId === 'string') {
        const viewport = this.viewportManager.findViewportById(viewportOrId);
        if (!viewport) {
          throw new Error(`Viewport not found: ${viewportOrId}`);
        }
        return viewport;
      }
      return viewportOrId;
    });

    return this.viewportManager.createAdjacentViewport(existingViewports, direction, size);
  }

  /**
   * Split a viewport into two viewports
   */
  splitViewport(
    viewport: Viewport | string,
    direction: 'up' | 'down' | 'left' | 'right',
    ratio?: number
  ): Viewport {
    const viewportObj = this.resolveViewport(viewport);
    return this.viewportManager.splitViewport(viewportObj, direction, ratio);
  }

  removeViewport(viewport: Viewport | string): boolean {
    const viewportObj = this.resolveViewport(viewport);
    return this.viewportManager.removeViewport(viewportObj);
  }

  swapViewports(viewport1: Viewport | string, viewport2: Viewport | string): boolean {
    const viewport1Obj = this.resolveViewport(viewport1);
    const viewport2Obj = this.resolveViewport(viewport2);
    return this.viewportManager.swapViewports(viewport1Obj, viewport2Obj);
  }

  getViewports(): Viewport[] {
    return this.viewportManager.getViewports();
  }

  hasViewport(viewportId: string): boolean {
    return this.viewportManager.findViewportById(viewportId) !== null;
  }

  minimizeViewport(viewport: Viewport | string): boolean {
    const viewportObj = this.resolveViewport(viewport);
    return this.viewportManager.minimizeViewport(viewportObj);
  }

  maximizeViewport(viewport: Viewport | string): boolean {
    const viewportObj = this.resolveViewport(viewport);
    return this.viewportManager.maximizeViewport(viewportObj);
  }

  restoreViewport(viewport: Viewport | string): boolean {
    const viewportObj = this.resolveViewport(viewport);
    return this.viewportManager.restoreViewport(viewportObj);
  }

  //
  // it will be the responsibility of the calling code to call
  // Workspace.updateWorkspace (ScreenBounds?) (currentContext: WorkspaceConext)
  // to create the screen bounds for the viewports
  updateScreenBounds(newScreenBounds: ScreenBounds): void {
    // Update workspace screen bounds
    (this as { -readonly [K in keyof this]: this[K] }).screenBounds = newScreenBounds;

    this.viewportManager.setScreenBounds(newScreenBounds);
  }

  private createDefaultLayout(): ViewportManager {
    return new ViewportManager(this.idGenerator);
  }

  private resolveViewport(viewportOrId: Viewport | string): Viewport {
    if (typeof viewportOrId === 'string') {
      const viewport = this.viewportManager.findViewportById(viewportOrId);
      if (!viewport) {
        throw new Error(`Viewport not found: ${viewportOrId}`);
      }
      return viewport;
    }
    return viewportOrId;
  }
}
