import {
  WorkspaceInterface,
  WorkspaceConfig,
  ScreenBounds,
  ProportionalBounds,
  WorkspaceContext,
} from './types';
import { MutableViewport, Viewport, ViewportManager } from '../viewport';

export class Workspace implements WorkspaceInterface {
  public readonly id: string;
  public readonly name: string;
  public screenBounds!: ScreenBounds;
  public viewports: Map<string, MutableViewport> = new Map();
  private readonly viewportManager: ViewportManager;

  constructor(config: WorkspaceConfig) {
    this.id = config.id;
    this.name = config.name;
    this.viewportManager = new ViewportManager(
      config.workspaceContexts,
      config.idGenerator,
      this.viewports
    );
  }

  createViewport(_proportionalBounds?: ProportionalBounds): Viewport {
    // Delegate to viewport manager (it will find optimal placement if no bounds provided)
    throw new Error(`createViewport not implemented`);
  }

  createAdjacentViewport(
    existingViewportsOrIds: (Viewport | string)[],
    direction: 'up' | 'down' | 'left' | 'right',
    size?: { width?: number; height?: number }
  ): Viewport {
    // Resolve any IDs to viewport objects
    const existingViewports = existingViewportsOrIds.map((viewportOrId) => {
      if (typeof viewportOrId === 'string') {
        const viewport = this.findViewportById(viewportOrId);
        if (!viewport) {
          throw new Error(`Viewport not found: ${viewportOrId}`);
        }
        return viewport;
      }
      return viewportOrId;
    });

    return this.viewportManager.createAdjacentViewport(existingViewports, direction, size);
  }

  getCurrentContext(): WorkspaceContext | undefined {
    return this.viewportManager.currentContext;
  }

  hasViewport(viewport: Viewport | string): boolean {
    return this.resolveViewport(viewport) !== null;
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

  removeViewport(viewport: Viewport | string): boolean {
    const viewportObj = this.resolveViewport(viewport);
    return this.viewportManager.removeViewport(viewportObj);
  }

  setScreenBounds(screenBounds: ScreenBounds): void {
    this.screenBounds = screenBounds;

    this.viewportManager.setScreenBounds(screenBounds);
  }

  splitViewport(
    viewport: Viewport | string,
    direction: 'up' | 'down' | 'left' | 'right',
    ratio?: number
  ): Viewport {
    const viewportObj = this.resolveViewport(viewport);
    return this.viewportManager.splitViewport(viewportObj, direction, ratio);
  }

  swapViewports(viewport1: Viewport | string, viewport2: Viewport | string): boolean {
    const viewport1Obj = this.resolveViewport(viewport1);
    const viewport2Obj = this.resolveViewport(viewport2);
    return this.viewportManager.swapViewports(viewport1Obj, viewport2Obj);
  }

  private findViewportById(viewportId: string): Viewport | null {
    return this.viewports.get(viewportId) || null;
  }

  private resolveViewport(viewportOrId: Viewport | string): Viewport {
    if (typeof viewportOrId === 'string') {
      const viewport = this.findViewportById(viewportOrId);
      if (!viewport) {
        throw new Error(`Viewport not found: ${viewportOrId}`);
      }
      return viewport;
    }
    return viewportOrId;
  }
}
