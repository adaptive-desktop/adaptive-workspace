/**
 * @fileoverview Layout Manager Interfaces
 *
 * Defines the interface for managing workspace layouts with viewports.
 * This abstracts away the binary tree implementation details and focuses
 * on what users actually care about: where viewports are positioned.
 *
 * Domain Model:
 * - Workspace: The container (React Native component)
 * - Layout: The organization of viewports within a workspace
 * - Viewport: Individual layout areas where panels live
 * - Panel: The "virtual window" component with header bar/menus
 */

// Position within the layout grid
export interface ViewportPosition {
  row: number;    // 0-based row position
  column: number; // 0-based column position
}

// Viewport bounds definition
export interface ViewportBounds {
  name: string;
  rowStart: number;    // 0-based inclusive
  rowEnd: number;      // 0-based exclusive
  columnStart: number; // 0-based inclusive
  columnEnd: number;   // 0-based exclusive
}

// Layout dimensions
export interface LayoutSize {
  rows: number;    // Number of row tracks
  columns: number; // Number of column tracks
}

/**
 * Layout Manager Interface
 *
 * Manages the organization of viewports within a workspace.
 * The Workspace contains a Layout, and the LayoutManager handles the layout operations.
 *
 * Operation Rules:
 * - removeViewport: Adjacent viewports expand proportionally (configurable in future)
 * - splitViewport: Original content position determined by implementation
 * - swapViewports: Clean exchange of two panels, no layout changes
 * - insertViewport: New viewport spans the range of specified positions
 */
export interface LayoutManager<T> {
  // Viewport query operations
  getViewportAt(position: ViewportPosition): T | null;
  getAllViewports(): T[];
  getViewportCount(): number;
  getLayoutSize(): LayoutSize;

  // Layout introspection
  getLayoutTemplate(): T[][];  // 2D array representation for debugging/testing
  getViewportBounds(panelId: T): ViewportBounds | null;

  // Single viewport operations
  splitViewport(position: ViewportPosition, newPanelId: T, direction: 'horizontal' | 'vertical'): LayoutManager<T>;
  removeViewport(position: ViewportPosition): LayoutManager<T>;  // Adjacent viewports expand proportionally
  swapViewports(panelId1: T, panelId2: T): LayoutManager<T>;     // Clean exchange, no displacement complexity

  // Multi-viewport operations
  insertViewport(viewportPositions: ViewportPosition[], newPanelId: T, direction?: 'above' | 'below' | 'left' | 'right'): LayoutManager<T>;

  // Utility operations
  isValidPosition(position: ViewportPosition): boolean;
  getPositionForPanel(panelId: T): ViewportPosition | null;
  canSplitViewport(position: ViewportPosition): boolean;
  canRemoveViewport(position: ViewportPosition): boolean;
}

/**
 * Layout Operation Types
 *
 * Operation types for testing layout management.
 */
export type LayoutOperation =
  | { type: 'splitViewport'; position: ViewportPosition; newPanelId: string; direction: 'horizontal' | 'vertical' }
  | { type: 'removeViewport'; position: ViewportPosition }
  | { type: 'swapViewports'; panelId1: string; panelId2: string }
  | { type: 'insertViewport'; viewportPositions: ViewportPosition[]; newPanelId: string; direction: 'above' | 'below' | 'left' | 'right' };

/**
 * Expected Layout Test Result
 *
 * Defines what we expect after a layout operation.
 */
export interface ExpectedLayoutResult {
  success: boolean;
  finalTemplate?: string[][];
  viewportCount?: number;
  layoutSize?: LayoutSize;
  errorMessage?: string;
  affectedPanels?: string[];
}

/**
 * Layout Test Scenario
 *
 * Defines a complete test case for layout operations.
 */
export interface LayoutTestScenario {
  name: string;
  description: string;
  initialTemplate: string[][];
  operation: LayoutOperation;
  expected: ExpectedLayoutResult;
}
