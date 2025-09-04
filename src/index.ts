/**
 * @fileoverview Main entry point for @adaptive-desktop/binary-layout-tree
 *
 * This is the main entry point for the binary layout tree library.
 * It exports all public APIs for managing binary layout trees.
 */

// Core classes
export { LayoutTree } from './LayoutTree';

// Type definitions
export * from './types';

// Utility functions
export * from './utils/treeUtils';
export * from './utils/pathUtils';

// Version information
export const VERSION = '0.1.0';
