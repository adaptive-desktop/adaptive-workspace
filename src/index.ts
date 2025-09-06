/**
 * @fileoverview Main entry point for @adaptive-desktop/adaptive-workspace
 *
 * This is the main entry point for the adaptive workspace library.
 * It exports all public APIs for managing workspace layouts.
 */

// Domain exports
export * from './workspace';
export * from './viewport';
export * from './layout';
export * from './shared';

// Legacy utility functions (TODO: organize into domains)
export * from './utils/treeUtils';
export * from './utils/pathUtils';
export * from './utils/serialization';
export * from './utils/boundsUtils';
export * from './utils/layoutActions';
export * from './utils/validation';

// Version information
export const VERSION = '0.2.0';
