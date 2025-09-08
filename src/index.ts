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

// Utility functions
export * from './utils/boundsUtils';
export * from './utils/validation';

// Version information
export const VERSION = '0.4.0';
