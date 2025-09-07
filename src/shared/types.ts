/**
 * @fileoverview Core type definitions for the viewport-based layout system
 *
 * This module defines the fundamental data structures used throughout the
 * viewport-based layout system. All types are generic and framework-agnostic.
 */

/**
 * Common dimensional interface used across all components
 */
export interface Dimensions {
  width: number;
  height: number;
}

/**
 * Complete bounds information including position and size
 */
export interface Bounds {
  x: number;
  y: number;
  width: number;
  height: number;
}
