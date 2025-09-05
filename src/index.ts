/**
 * @fileoverview Main entry point for @adaptive-desktop/adaptive-workspace
 *
 * This is the main entry point for the adaptive workspace library.
 * It exports all public APIs for managing workspace layouts.
 */

// Core classes
export { LayoutTree } from './LayoutTree';

// Workspace management interfaces
export * from './interfaces/LayoutManager';

// Type definitions
export * from './types';

// Utility functions
export * from './utils/treeUtils';
export * from './utils/pathUtils';
export * from './utils/serialization';
export * from './utils/boundsUtils';
export * from './utils/layoutActions';
export * from './utils/validation';

// Factory functions and workspace types
export {
  createWorkspace,
  createViewport,
  calculateScreenBounds,
  type ScreenBounds,
  type Workspace,
  type Viewport
} from './lib/workspace';

// Version information
export const VERSION = '0.2.0';
