import { ProportionalBounds, ScreenBounds } from '../workspace';

export interface Viewport {
  readonly id: string;
  readonly isDefault: boolean;
  readonly isMinimized: boolean;
  readonly isMaximized: boolean;
  readonly isRequired: boolean;
  readonly screenBounds: ScreenBounds;
}

export interface ViewportManagerInterface {
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

export interface ViewportRequest {
  id?: string;
  bounds?: ProportionalBounds;
  from?: Viewport;

  // Optionally add more metadata (e.g., type, initial state)
}

export interface ViewportSnapshot {
  readonly bounds?: ProportionalBounds;
  readonly id: string;
  readonly isDefault: boolean;
  readonly isMaximized: boolean;
  readonly isMinimized: boolean;
  readonly isRequired: boolean;
  readonly workspaceContextId: string;
  readonly timestamp: number;
}

export interface ViewportState {
  viewportSnapshots: ViewportSnapshot[];
}
